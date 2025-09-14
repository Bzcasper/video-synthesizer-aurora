// supabase/functions/generate-video/core/BackgroundTasks.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { ErrorHandler } from "./ErrorHandler";
import { StorageUtils } from "../utils/storage";
import { DB_TABLES, SYSTEM } from "../config/constants";
import { logger } from "../utils/logging";

/**
 * Class for managing background tasks
 */
export class BackgroundTasks {
  private supabase: ReturnType<typeof createClient>;
  private errorHandler: ErrorHandler;
  private storageUtils: StorageUtils;
  private isRunning = false;

  constructor(
    supabaseClient: ReturnType<typeof createClient>,
    errorHandler: ErrorHandler,
  ) {
    this.supabase = supabaseClient;
    this.errorHandler = errorHandler;
    this.storageUtils = new StorageUtils(supabaseClient, errorHandler);
  }

  /**
   * Initialize and schedule background tasks
   */
  async initialize(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      // Perform initial maintenance
      await this.performMaintenance();

      // Schedule regular maintenance
      // For Edge Functions, we would use a separate cron-triggered function
      // but for simplicity, we'll just run it once during initialization
      logger.info("Background tasks initialized");
    } catch (error) {
      logger.error("Error initializing background tasks:", error);
      this.isRunning = false;
    }
  }

  /**
   * Perform maintenance tasks
   */
  async performMaintenance(): Promise<void> {
    try {
      logger.info("Running maintenance tasks");

      // Tasks to run:
      await Promise.all([
        this.cleanupTemporaryAssets(),
        this.resetStuckJobs(),
        this.pruneOldData(),
      ]);

      logger.info("Maintenance tasks completed");
    } catch (error) {
      logger.error("Error performing maintenance:", error);
    }
  }

  /**
   * Clean up temporary assets
   */
  private async cleanupTemporaryAssets(): Promise<void> {
    try {
      logger.info("Cleaning up temporary assets");

      // Find completed and failed jobs that are older than 1 day
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data: oldJobs, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select("id")
        .in("status", ["completed", "failed", "cancelled"])
        .lt("created_at", oneDayAgo.toISOString());

      if (error) {
        throw this.errorHandler.wrapError(error, "Failed to query old jobs");
      }

      if (!oldJobs || oldJobs.length === 0) {
        return;
      }

      logger.info(`Found ${oldJobs.length} old jobs to clean up`);

      // Clean up frame assets for each job
      for (const job of oldJobs) {
        const framePath = `${SYSTEM.STORAGE.FRAMES_PATH}/${job.id}/`;

        // List all frames for the job
        const frames = await this.storageUtils.listFiles(framePath);

        if (frames.length > 0) {
          logger.debug(`Cleaning up ${frames.length} frames for job ${job.id}`);

          // Delete each frame
          for (const frame of frames) {
            await this.storageUtils.deleteFile(`${framePath}${frame}`);
          }
        }
      }

      logger.info("Temporary assets cleanup completed");
    } catch (error) {
      logger.error("Error cleaning up temporary assets:", error);
    }
  }

  /**
   * Reset stuck jobs
   */
  private async resetStuckJobs(): Promise<void> {
    try {
      logger.info("Checking for stuck jobs");

      // Find processing jobs that haven't been updated in a while
      const stuckTimeThreshold = new Date();
      stuckTimeThreshold.setMinutes(stuckTimeThreshold.getMinutes() - 30); // 30 minutes

      const { data: stuckJobs, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select("id")
        .eq("status", "processing")
        .lt("updated_at", stuckTimeThreshold.toISOString());

      if (error) {
        throw this.errorHandler.wrapError(error, "Failed to query stuck jobs");
      }

      if (!stuckJobs || stuckJobs.length === 0) {
        return;
      }

      logger.info(`Found ${stuckJobs.length} stuck jobs to reset`);

      // Reset each stuck job
      for (const job of stuckJobs) {
        logger.debug(`Resetting stuck job ${job.id}`);

        const { error: updateError } = await this.supabase
          .from(DB_TABLES.VIDEO_JOBS)
          .update({
            status: "failed",
            error: "Job processing timed out",
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);

        if (updateError) {
          logger.error(`Failed to reset stuck job ${job.id}:`, updateError);
        }
      }

      logger.info("Stuck jobs reset completed");
    } catch (error) {
      logger.error("Error resetting stuck jobs:", error);
    }
  }

  /**
   * Prune old data
   */
  private async pruneOldData(): Promise<void> {
    try {
      logger.info("Pruning old data");

      // For now, we'll just count how many old records we have
      // In a real implementation, you might archive or delete old data

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select("*", { count: "exact", head: true })
        .lt("created_at", thirtyDaysAgo.toISOString());

      if (error) {
        throw this.errorHandler.wrapError(
          error,
          "Failed to count old job records",
        );
      }

      logger.info(`Found ${count} job records older than 30 days`);

      // In a real implementation, you might:
      // 1. Archive old data to a long-term storage
      // 2. Delete old temporary data
      // 3. Aggregate metrics and delete raw data

      logger.info("Data pruning completed");
    } catch (error) {
      logger.error("Error pruning old data:", error);
    }
  }
}
