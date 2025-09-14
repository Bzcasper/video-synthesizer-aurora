// supabase/functions/generate-video/core/ProgressTracker.ts

import { createClient } from "@supabase/supabase-js";
import { DB_TABLES, WEBHOOK_EVENTS, SYSTEM } from "../config/constants";
import { ErrorHandler } from "./ErrorHandler";
import { logger } from "../utils/logging";

/**
 * Interface for progress update data
 */
export interface ProgressUpdate {
  jobId: string;
  progress: number;
  status: string;
  stage: string;
  timestamp: Date;
}

/**
 * Class for tracking and reporting video generation progress
 */
export class ProgressTracker {
  private supabase: ReturnType<typeof createClient>;
  private errorHandler: ErrorHandler;
  private progressCache: Map<string, number>;
  private updateThrottleMap: Map<string, NodeJS.Timeout>;

  /**
   * Creates a new ProgressTracker instance
   * @param supabaseClient Initialized Supabase client
   * @param errorHandler Error handler instance
   */
  constructor(
    supabaseClient: ReturnType<typeof createClient>,
    errorHandler: ErrorHandler,
  ) {
    this.supabase = supabaseClient;
    this.errorHandler = errorHandler;
    this.progressCache = new Map();
    this.updateThrottleMap = new Map();
  }

  /**
   * Update progress for a job
   * @param jobId Job identifier
   * @param progress Progress percentage (0-100)
   * @param stage Current processing stage description
   * @returns Promise that resolves when the update is complete
   */
  async updateProgress(
    jobId: string,
    progress: number,
    stage: string,
  ): Promise<void> {
    // Validate progress value
    progress = Math.max(0, Math.min(100, Math.round(progress)));

    // Only update if progress has changed significantly (to reduce database writes)
    const cachedProgress = this.progressCache.get(jobId) || 0;
    const progressDelta = progress - cachedProgress;

    // Only update if progress increased by at least 1% or reached 100%
    if (progressDelta < 1 && progress < 100 && progress > 0) {
      return;
    }

    // Update the progress cache
    this.progressCache.set(jobId, progress);

    // Throttle database updates to prevent too many writes
    // If there's already a pending update for this job, clear it
    if (this.updateThrottleMap.has(jobId)) {
      clearTimeout(this.updateThrottleMap.get(jobId));
    }

    // Schedule the update
    const timeoutId = setTimeout(async () => {
      try {
        await this.performProgressUpdate(jobId, progress, stage);
        this.updateThrottleMap.delete(jobId);
      } catch (error) {
        logger.error(`Error updating progress for job ${jobId}:`, error);
      }
    }, 500); // Throttle to one update every 500ms maximum

    this.updateThrottleMap.set(jobId, timeoutId);

    // For 0%, 100%, or significant changes, update immediately
    if (progress === 0 || progress === 100 || progressDelta >= 10) {
      clearTimeout(timeoutId);
      this.updateThrottleMap.delete(jobId);

      try {
        await this.performProgressUpdate(jobId, progress, stage);
      } catch (error) {
        logger.error(`Error updating progress for job ${jobId}:`, error);
      }
    }
  }

  /**
   * Perform the actual progress update in the database and send webhook if configured
   * @param jobId Job identifier
   * @param progress Progress percentage
   * @param stage Current processing stage
   * @private
   */
  private async performProgressUpdate(
    jobId: string,
    progress: number,
    stage: string,
  ): Promise<void> {
    try {
      // Update progress in database
      const updateData = {
        progress,
        status_message: stage,
        updated_at: new Date().toISOString(),
      };

      // Update the job record
      const { error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update(updateData)
        .eq("id", jobId);

      if (error) {
        throw this.errorHandler.wrapError(
          error,
          `Failed to update progress for job ${jobId}`,
        );
      }

      // Log progress update
      logger.debug(
        `Updated progress for job ${jobId}: ${progress}% - ${stage}`,
      );

      // Send progress update webhook if configured for this job
      await this.sendProgressWebhook(jobId, progress, stage);
    } catch (error) {
      logger.error(`Error performing progress update for job ${jobId}:`, error);
      // Don't throw here to avoid breaking the video generation process
    }
  }

  /**
   * Send a progress update via webhook
   * @param jobId Job identifier
   * @param progress Progress percentage
   * @param stage Current processing stage
   * @private
   */
  private async sendProgressWebhook(
    jobId: string,
    progress: number,
    stage: string,
  ): Promise<void> {
    try {
      // Check if job has a webhook configured
      const { data: job, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select("webhook_url, user_id")
        .eq("id", jobId)
        .single();

      if (error || !job || !job.webhook_url) {
        return; // No webhook configured or job not found
      }

      // Determine webhook event type based on progress
      let eventType = WEBHOOK_EVENTS.JOB_PROGRESS;

      if (progress === 0) {
        eventType = WEBHOOK_EVENTS.JOB_STARTED;
      } else if (progress === 100) {
        eventType = WEBHOOK_EVENTS.JOB_COMPLETED;
      }

      // Prepare webhook payload
      const payload = {
        event: eventType,
        jobId,
        userId: job.user_id,
        progress,
        stage,
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
          `Webhook for job ${jobId} returned status ${webhookResponse.status}: ${webhookResponse.statusText}`,
        );
      } else {
        logger.debug(`Successfully sent ${eventType} webhook for job ${jobId}`);
      }
    } catch (error) {
      logger.error(`Error sending progress webhook for job ${jobId}:`, error);
      // Don't throw here to avoid breaking the video generation process
    }
  }

  /**
   * Get the current progress for a job
   * @param jobId Job identifier
   * @returns Current progress information
   */
  async getJobProgress(jobId: string): Promise<{
    progress: number;
    stage: string;
    status: string;
  }> {
    try {
      // Get job from database
      const { data, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select("progress, status_message, status")
        .eq("id", jobId)
        .single();

      if (error) {
        throw this.errorHandler.wrapError(
          error,
          `Failed to get progress for job ${jobId}`,
        );
      }

      return {
        progress: data.progress || 0,
        stage: data.status_message || "",
        status: data.status,
      };
    } catch (error) {
      logger.error(`Error getting progress for job ${jobId}:`, error);

      // Return default values if there's an error
      return {
        progress: 0,
        stage: "Unknown",
        status: "unknown",
      };
    }
  }

  /**
   * Record a progress event in the job history
   * @param jobId Job identifier
   * @param event Event description
   * @param details Additional event details
   */
  async recordEvent(
    jobId: string,
    event: string,
    details?: any,
  ): Promise<void> {
    try {
      // In a production system, you would store this in a job_events table
      // For now, we'll just log it
      logger.info(
        `[Job ${jobId}] ${event}${details ? ": " + JSON.stringify(details) : ""}`,
      );
    } catch (error) {
      logger.error(`Error recording event for job ${jobId}:`, error);
      // Don't throw here to avoid breaking the video generation process
    }
  }

  /**
   * Check and report estimated time remaining for a job
   * @param jobId Job identifier
   * @param currentProgress Current progress percentage
   * @param startTime Job start time
   * @returns Estimated seconds remaining
   */
  async estimateTimeRemaining(
    jobId: string,
    currentProgress: number,
    startTime: Date,
  ): Promise<number> {
    if (currentProgress <= 0) {
      return 0; // Cannot estimate if no progress has been made
    }

    try {
      // Calculate elapsed time in seconds
      const elapsedSeconds = (Date.now() - startTime.getTime()) / 1000;

      // Calculate estimate based on progress and elapsed time
      const progressPercent = currentProgress / 100;
      const totalEstimatedSeconds = elapsedSeconds / progressPercent;
      const remainingSeconds = totalEstimatedSeconds - elapsedSeconds;

      // Log the estimate
      logger.debug(
        `Job ${jobId}: Estimated ${Math.round(remainingSeconds)}s remaining (${currentProgress}% complete in ${Math.round(elapsedSeconds)}s)`,
      );

      return Math.max(0, Math.round(remainingSeconds));
    } catch (error) {
      logger.error(`Error estimating time remaining for job ${jobId}:`, error);
      return 0;
    }
  }

  /**
   * Clean up tracker resources for a job
   * @param jobId Job identifier
   */
  cleanupJob(jobId: string): void {
    // Remove from cache
    this.progressCache.delete(jobId);

    // Clear any pending updates
    if (this.updateThrottleMap.has(jobId)) {
      clearTimeout(this.updateThrottleMap.get(jobId));
      this.updateThrottleMap.delete(jobId);
    }
  }
}
