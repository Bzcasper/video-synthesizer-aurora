import { createClient } from "@supabase/supabase-js";
import { DB_TABLES, QUOTA } from "../config/constants";
import { ErrorHandler } from "./ErrorHandler";
import { logger } from "../utils/logging";

export class JobValidator {
  constructor(
    private supabase: ReturnType<typeof createClient>,
    private errorHandler: ErrorHandler,
  ) {}

  async checkUserLimits(userId: string): Promise<void> {
    try {
      // Get current month's usage for the user
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const { data, error } = await this.supabase
        .from(DB_TABLES.MONTHLY_USAGE)
        .select("video_count, user_tier")
        .eq("user_id", userId)
        .eq("year", year)
        .eq("month", month)
        .single();

      if (error && error.code !== "PGRST116") {
        throw this.errorHandler.wrapError(
          error,
          `Failed to check monthly usage for user ${userId}`,
        );
      }

      if (!data) return;

      const tierLimits =
        data.user_tier === "pro"
          ? QUOTA.PRO_TIER.MAX_VIDEOS
          : QUOTA.FREE_TIER.MAX_VIDEOS;

      if (data.video_count >= tierLimits) {
        throw new Error(
          `User ${userId} has reached their monthly limit of ${tierLimits} videos`,
        );
      }
    } catch (error) {
      logger.error(`Error checking monthly usage for user ${userId}:`, error);

      if (
        error instanceof Error &&
        error.message.includes("has reached their monthly limit")
      ) {
        throw error;
      }

      logger.warn(
        `Continuing despite error checking monthly usage for user ${userId}`,
      );
    }
  }

  async updateMonthlyUsage(userId: string): Promise<void> {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      let userTier = "free";

      try {
        const { data, error } = await this.supabase
          .from("users")
          .select("tier")
          .eq("id", userId)
          .single();

        if (!error && data) {
          userTier = data.tier;
        }
      } catch (error) {
        logger.warn(
          `Error getting user tier for ${userId}, defaulting to 'free':`,
          error,
        );
      }

      const { data, error } = await this.supabase
        .from(DB_TABLES.MONTHLY_USAGE)
        .update({
          video_count: this.supabase.rpc("increment"),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("year", year)
        .eq("month", month)
        .select();

      if (error || !data || data.length === 0) {
        await this.supabase.from(DB_TABLES.MONTHLY_USAGE).insert({
          user_id: userId,
          year,
          month,
          video_count: 1,
          user_tier: userTier,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      logger.error(`Error updating monthly usage for user ${userId}:`, error);
    }
  }
}
