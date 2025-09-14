import { createClient } from "@supabase/supabase-js";
import { DB_TABLES } from "../config/constants";
import { ErrorHandler } from "./errorhandler";
import { logger } from "../utils/logging";
import { VideoJob } from "./types";

export class JobStatusManager {
  constructor(
    private supabase: ReturnType<typeof createClient>,
    private errorHandler: ErrorHandler,
  ) {}

  async updateJobStatus(
    jobId: string,
    status: VideoJob["status"],
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", jobId);

      if (error) {
        throw this.errorHandler.wrapError(
          error,
          `Failed to update status for job ${jobId}`,
        );
      }
    } catch (error) {
      logger.error(`Error updating status for job ${jobId}:`, error);
    }
  }

  async updateJobCompletion(
    jobId: string,
    videoUrl: string,
    thumbnailUrl: string,
  ): Promise<void> {
    try {
      const updateData = {
        status: "completed",
        progress: 100,
        output_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update(updateData)
        .eq("id", jobId);

      if (error) {
        throw this.errorHandler.wrapError(
          error,
          `Failed to update completion for job ${jobId}`,
        );
      }
    } catch (error) {
      logger.error(`Error updating completion for job ${jobId}:`, error);
    }
  }

  async updateJobFailure(jobId: string, errorMessage: string): Promise<void> {
    try {
      const updateData = {
        status: "failed",
        error: errorMessage,
        updated_at: new Date().toISOString(),
      };

      const { error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update(updateData)
        .eq("id", jobId);

      if (error) {
        throw this.errorHandler.wrapError(
          error,
          `Failed to update failure for job ${jobId}`,
        );
      }
    } catch (error) {
      logger.error(`Error updating failure for job ${jobId}:`, error);
    }
  }

  async getNextJob(): Promise<VideoJob | null> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }

        throw this.errorHandler.wrapError(
          error,
          "Failed to get next job from queue",
        );
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        prompt: data.prompt,
        settings: data.settings,
        createdAt: new Date(data.created_at),
        status: data.status,
        progress: data.progress,
        error: data.error,
        outputUrl: data.output_url,
        thumbnailUrl: data.thumbnail_url,
      };
    } catch (error) {
      logger.error("Error getting next job from queue:", error);
      return null;
    }
  }
}
