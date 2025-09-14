// supabase/functions/generate-video/core/ErrorHandler.ts

import { createClient } from "@supabase/supabase-js";
import {
  ERROR_TYPES,
  WEBHOOK_EVENTS,
  DB_TABLES,
  SYSTEM,
} from "../config/constants";
import { VideoJob, VideoGenerationResult } from "./VideoGenerator";
import { logger } from "../utils/logging";

/**
 * Interface for error details
 */
export interface ErrorDetails {
  errorType: string;
  message: string;
  stack?: string;
  context?: any;
  isRetryable: boolean;
  retryCount?: number;
  originalError?: any;
}

/**
 * Custom error class for video generation errors
 */
export class VideoGenerationError extends Error {
  errorType: string;
  isRetryable: boolean;
  retryCount: number;
  context?: any;
  originalError?: any;

  constructor(
    message: string,
    options: {
      errorType: string;
      isRetryable?: boolean;
      retryCount?: number;
      context?: any;
      originalError?: any;
    },
  ) {
    super(message);
    this.name = "VideoGenerationError";
    this.errorType = options.errorType;
    this.isRetryable =
      options.isRetryable !== undefined ? options.isRetryable : false;
    this.retryCount = options.retryCount || 0;
    this.context = options.context;
    this.originalError = options.originalError;
  }
}

/**
 * Class for handling and recovering from errors during video generation
 */
export class ErrorHandler {
  private supabase: ReturnType<typeof createClient>;
  private retryMap: Map<string, number>;

  /**
   * Creates a new ErrorHandler instance
   * @param supabaseClient Initialized Supabase client
   */
  constructor(supabaseClient: ReturnType<typeof createClient>) {
    this.supabase = supabaseClient;
    this.retryMap = new Map();
  }

  /**
   * Wrap an error with additional context
   * @param error Original error
   * @param message Error message
   * @param options Additional error options
   * @returns Wrapped error with context
   */
  wrapError(
    error: any,
    message: string,
    options: {
      errorType?: string;
      isRetryable?: boolean;
      context?: any;
    } = {},
  ): VideoGenerationError {
    // Determine error type based on the original error
    let errorType = options.errorType || ERROR_TYPES.UNKNOWN;

    if (error instanceof Error) {
      // Determine error type based on error message or name
      if (
        error.message.includes("timeout") ||
        error.message.includes("timed out")
      ) {
        errorType = ERROR_TYPES.TIMEOUT;
      } else if (
        error.message.includes("storage") ||
        error.message.includes("bucket")
      ) {
        errorType = ERROR_TYPES.STORAGE;
      } else if (
        error.message.includes("model") ||
        error.message.includes("inference")
      ) {
        errorType = ERROR_TYPES.MODEL;
      } else if (
        error.message.includes("validation") ||
        error.message.includes("invalid")
      ) {
        errorType = ERROR_TYPES.VALIDATION;
      } else if (
        error.message.includes("system") ||
        error.message.includes("internal")
      ) {
        errorType = ERROR_TYPES.SYSTEM;
      }
    }

    // Determine if error is retryable based on type
    const isRetryable =
      options.isRetryable !== undefined
        ? options.isRetryable
        : [ERROR_TYPES.TIMEOUT, ERROR_TYPES.SYSTEM, ERROR_TYPES.MODEL].includes(
            errorType,
          );

    // Create wrapped error
    return new VideoGenerationError(message, {
      errorType,
      isRetryable,
      context: options.context,
      originalError: error,
    });
  }

  /**
   * Handle an error during video generation
   * @param job Video generation job
   * @param error Error that occurred
   * @returns Video generation result or throws if unrecoverable
   */
  async handleVideoGenerationError(
    job: VideoJob,
    error: any,
  ): Promise<VideoGenerationResult> {
    // Wrap error if it's not already a VideoGenerationError
    const wrappedError =
      error instanceof VideoGenerationError
        ? error
        : this.wrapError(error, "Error during video generation");

    // Log the error
    logger.error(
      `Error processing job ${job.id} (${wrappedError.errorType}): ${wrappedError.message}`,
      {
        jobId: job.id,
        errorType: wrappedError.errorType,
        isRetryable: wrappedError.isRetryable,
        originalError: wrappedError.originalError,
      },
    );

    // Check if we should retry the job
    if (wrappedError.isRetryable) {
      const retryCount = this.retryMap.get(job.id) || 0;

      if (retryCount < SYSTEM.MAX_RETRIES) {
        // Increment retry count
        this.retryMap.set(job.id, retryCount + 1);

        // Log retry attempt
        logger.info(
          `Retrying job ${job.id} (attempt ${retryCount + 1} of ${SYSTEM.MAX_RETRIES})`,
        );

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, SYSTEM.RETRY_DELAY));

        // TODO: Implement actual retry logic
        // In a real implementation, you would call the video generation process again
        // For now, we'll just throw to simulate a failed retry

        throw new Error(`Retry failed: ${wrappedError.message}`);
      }
    }

    // Update job status to failed
    await this.updateJobFailure(job, wrappedError);

    // Send failure webhook if configured
    await this.sendFailureWebhook(job.id, wrappedError);

    // Rethrow the error
    throw wrappedError;
  }

  /**
   * Update job record to reflect failure
   * @param job Failed job
   * @param error Error that caused the failure
   * @private
   */
  private async updateJobFailure(
    job: VideoJob,
    error: VideoGenerationError,
  ): Promise<void> {
    try {
      // Create error message with context
      const errorMessage = `${error.message} (${error.errorType})`;

      // Update job record
      const { error: updateError } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update({
          status: "failed",
          error: errorMessage,
          progress: job.progress || 0, // Preserve current progress
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      if (updateError) {
        logger.error(
          `Error updating job failure for job ${job.id}:`,
          updateError,
        );
      }
    } catch (dbError) {
      logger.error(`Error updating job failure for job ${job.id}:`, dbError);
    }
  }

  /**
   * Send a webhook notification about job failure
   * @param jobId ID of the failed job
   * @param error Error that caused the failure
   * @private
   */
  private async sendFailureWebhook(
    jobId: string,
    error: VideoGenerationError,
  ): Promise<void> {
    try {
      // Check if job has a webhook configured
      const { data: job, error: fetchError } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select("webhook_url, user_id")
        .eq("id", jobId)
        .single();

      if (fetchError || !job || !job.webhook_url) {
        return; // No webhook configured or job not found
      }

      // Prepare webhook payload
      const payload = {
        event: WEBHOOK_EVENTS.JOB_FAILED,
        jobId,
        userId: job.user_id,
        error: {
          message: error.message,
          type: error.errorType,
          isRetryable: error.isRetryable,
          retryCount: this.retryMap.get(jobId) || 0,
        },
        timestamp: new Date().toISOString(),
      };

      // Send webhook
      const webhookResponse = await fetch(job.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!webhookResponse.ok) {
        logger.warn(
          `Failure webhook for job ${jobId} returned status ${webhookResponse.status}: ${webhookResponse.statusText}`,
        );
      } else {
        logger.debug(`Successfully sent failure webhook for job ${jobId}`);
      }
    } catch (webhookError) {
      logger.error(
        `Error sending failure webhook for job ${jobId}:`,
        webhookError,
      );
    }
  }

  /**
   * Record error details for monitoring and debugging
   * @param jobId ID of the job that encountered an error
   * @param error Error that occurred
   * @param context Additional context for the error
   */
  async logError(jobId: string, error: any, context?: any): Promise<void> {
    try {
      // Extract error details
      const errorDetails: ErrorDetails = {
        errorType:
          error instanceof VideoGenerationError
            ? error.errorType
            : ERROR_TYPES.UNKNOWN,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context: {
          ...context,
          jobId,
          timestamp: new Date().toISOString(),
        },
        isRetryable:
          error instanceof VideoGenerationError ? error.isRetryable : false,
        retryCount: this.retryMap.get(jobId) || 0,
        originalError:
          error instanceof VideoGenerationError ? error.originalError : error,
      };

      // Log error details
      logger.error(
        `Job ${jobId} error (${errorDetails.errorType}): ${errorDetails.message}`,
        errorDetails,
      );

      // In a production system, you would store this in an error_logs table
      // or send to an external error monitoring service
    } catch (logError) {
      logger.error(`Error logging error for job ${jobId}:`, logError);
    }
  }

  /**
   * Get retry count for a job
   * @param jobId Job ID to check
   * @returns Current retry count
   */
  getRetryCount(jobId: string): number {
    return this.retryMap.get(jobId) || 0;
  }

  /**
   * Reset retry count for a job
   * @param jobId Job ID to reset
   */
  resetRetryCount(jobId: string): void {
    this.retryMap.delete(jobId);
  }

  /**
   * Check if an error is likely to be resolved by retrying
   * @param error Error to check
   * @returns True if the error is retryable
   */
  isRetryableError(error: any): boolean {
    if (error instanceof VideoGenerationError) {
      return error.isRetryable;
    }

    // For other errors, make a best guess based on error message
    const errorString = String(error);

    // Errors that are typically temporary and can be resolved by retrying
    const retryablePatterns = [
      "timeout",
      "timed out",
      "connection",
      "network",
      "temporary",
      "overloaded",
      "rate limit",
      "throttle",
      "too many requests",
      "5xx",
      "server error",
      "unavailable",
      "resource",
      "insufficient",
    ];

    // Check if error matches any retryable patterns
    return retryablePatterns.some((pattern) =>
      errorString.toLowerCase().includes(pattern),
    );
  }

  /**
   * Clean up handler resources for a job
   * @param jobId Job identifier
   */
  cleanupJob(jobId: string): void {
    this.retryMap.delete(jobId);
  }
}
