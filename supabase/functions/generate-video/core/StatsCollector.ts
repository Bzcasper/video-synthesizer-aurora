// supabase/functions/generate-video/core/StatsCollector.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { ErrorHandler } from "./ErrorHandler";
import { logger } from "../utils/logging";

/**
 * Job metrics for a single user
 */
export interface UserJobMetrics {
  userId: string;
  totalJobs: number;
  pendingJobs: number;
  processingJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  averageProcessingTime: number | null;
  averageQueueTime: number | null;
}

/**
 * System-wide metrics
 */
export interface SystemMetrics {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number | null;
  averageQueueTime: number | null;
  successRate: number;
  cpuUtilization: number | null;
  memoryUtilization: number | null;
  storageUtilization: number | null;
}

/**
 * Class for collecting and analyzing system metrics
 */
export class StatsCollector {
  private supabase: ReturnType<typeof createClient>;
  private errorHandler: ErrorHandler;

  constructor(
    supabaseClient: ReturnType<typeof createClient>,
    errorHandler: ErrorHandler,
  ) {
    this.supabase = supabaseClient;
    this.errorHandler = errorHandler;
  }

  /**
   * Collect metrics for a specific user
   */
  async getUserMetrics(userId: string): Promise<UserJobMetrics> {
    try {
      logger.info(`Collecting metrics for user ${userId}`);

      // Get job counts by status
      const { data: jobs, error } = await this.supabase
        .from("video_jobs")
        .select("status, created_at, started_at, completed_at")
        .eq("user_id", userId);

      if (error) {
        throw this.errorHandler.wrapError(
          error,
          `Failed to get jobs for user ${userId}`,
        );
      }

      if (!jobs || jobs.length === 0) {
        return {
          userId,
          totalJobs: 0,
          pendingJobs: 0,
          processingJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
          cancelledJobs: 0,
          averageProcessingTime: null,
          averageQueueTime: null,
        };
      }

      // Count jobs by status
      const counts = {
        total: jobs.length,
        pending: jobs.filter((j) => j.status === "pending").length,
        processing: jobs.filter((j) => j.status === "processing").length,
        completed: jobs.filter((j) => j.status === "completed").length,
        failed: jobs.filter((j) => j.status === "failed").length,
        cancelled: jobs.filter((j) => j.status === "cancelled").length,
      };

      // Calculate average queue time (time between creation and start)
      const queueTimes = jobs
        .filter((j) => j.started_at)
        .map((j) => {
          const createdAt = new Date(j.created_at);
          const startedAt = new Date(j.started_at);
          return (startedAt.getTime() - createdAt.getTime()) / 1000; // in seconds
        });

      const averageQueueTime =
        queueTimes.length > 0
          ? queueTimes.reduce((sum, time) => sum + time, 0) / queueTimes.length
          : null;

      // Calculate average processing time (time between start and completion)
      const processingTimes = jobs
        .filter((j) => j.started_at && j.completed_at)
        .map((j) => {
          const startedAt = new Date(j.started_at);
          const completedAt = new Date(j.completed_at);
          return (completedAt.getTime() - startedAt.getTime()) / 1000; // in seconds
        });

      const averageProcessingTime =
        processingTimes.length > 0
          ? processingTimes.reduce((sum, time) => sum + time, 0) /
            processingTimes.length
          : null;

      return {
        userId,
        totalJobs: counts.total,
        pendingJobs: counts.pending,
        processingJobs: counts.processing,
        completedJobs: counts.completed,
        failedJobs: counts.failed,
        cancelledJobs: counts.cancelled,
        averageProcessingTime,
        averageQueueTime,
      };
    } catch (error) {
      logger.error(`Error collecting metrics for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Collect system-wide metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      logger.info("Collecting system-wide metrics");

      // Get job counts
      const { data: jobStats, error: jobStatsError } = await this.supabase
        .from("video_jobs")
        .select("status, created_at, started_at, completed_at")
        .order("created_at", { ascending: false })
        .limit(1000); // Limit to recent jobs for better performance

      if (jobStatsError) {
        throw this.errorHandler.wrapError(
          jobStatsError,
          "Failed to get job statistics",
        );
      }

      if (!jobStats || jobStats.length === 0) {
        return {
          totalJobs: 0,
          activeJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
          averageProcessingTime: null,
          averageQueueTime: null,
          successRate: 0,
          cpuUtilization: null,
          memoryUtilization: null,
          storageUtilization: null,
        };
      }

      // Count jobs by status
      const totalJobs = jobStats.length;
      const activeJobs = jobStats.filter((j) =>
        ["pending", "processing"].includes(j.status),
      ).length;
      const completedJobs = jobStats.filter(
        (j) => j.status === "completed",
      ).length;
      const failedJobs = jobStats.filter((j) => j.status === "failed").length;

      // Calculate success rate
      const finishedJobs = completedJobs + failedJobs;
      const successRate =
        finishedJobs > 0 ? (completedJobs / finishedJobs) * 100 : 0;

      // Calculate average processing time
      const processingTimes = jobStats
        .filter((j) => j.started_at && j.completed_at)
        .map((j) => {
          const startedAt = new Date(j.started_at);
          const completedAt = new Date(j.completed_at);
          return (completedAt.getTime() - startedAt.getTime()) / 1000; // in seconds
        });

      const averageProcessingTime =
        processingTimes.length > 0
          ? processingTimes.reduce((sum, time) => sum + time, 0) /
            processingTimes.length
          : null;

      // Calculate average queue time
      const queueTimes = jobStats
        .filter((j) => j.started_at)
        .map((j) => {
          const createdAt = new Date(j.created_at);
          const startedAt = new Date(j.started_at);
          return (startedAt.getTime() - createdAt.getTime()) / 1000; // in seconds
        });

      const averageQueueTime =
        queueTimes.length > 0
          ? queueTimes.reduce((sum, time) => sum + time, 0) / queueTimes.length
          : null;

      // In a real implementation, you would gather CPU, memory, and storage metrics
      // from the underlying infrastructure, but for now we'll leave these as null
      const cpuUtilization = null;
      const memoryUtilization = null;
      const storageUtilization = null;

      return {
        totalJobs,
        activeJobs,
        completedJobs,
        failedJobs,
        averageProcessingTime,
        averageQueueTime,
        successRate,
        cpuUtilization,
        memoryUtilization,
        storageUtilization,
      };
    } catch (error) {
      logger.error("Error collecting system metrics:", error);
      throw error;
    }
  }

  /**
   * Record job completion for metrics
   */
  async recordJobCompletion(
    jobId: string,
    userId: string,
    status: "completed" | "failed",
    durationSeconds: number,
  ): Promise<void> {
    try {
      // In a real implementation, you might store detailed metrics
      // in a separate table for analytics purposes
      await this.supabase.from("job_metrics").insert({
        job_id: jobId,
        user_id: userId,
        status,
        duration_seconds: durationSeconds,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(
        `Error recording job completion metrics for job ${jobId}:`,
        error,
      );
      // Don't throw here to avoid disrupting the main process
    }
  }
}
