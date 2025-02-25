// supabase/functions/generate-video/utils/rate-limiter.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { QUOTA } from '../config/constants';
import { logger } from './logging';

/**
 * Interface for rate limit check result
 */
export interface RateLimitCheckResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

/**
 * Utility class for rate limiting API requests
 */
export class RateLimiter {
  private supabase: ReturnType<typeof createClient>;

  constructor(supabaseClient: ReturnType<typeof createClient>) {
    this.supabase = supabaseClient;
  }

  /**
   * Check if a request is allowed based on rate limits
   */
  async checkRateLimit(
    userId: string,
    userTier: 'free' | 'pro' = 'free'
  ): Promise<RateLimitCheckResult> {
    try {
      // Determine rate limit based on user tier
      const rateLimit = userTier === 'pro'
        ? QUOTA.RATE_LIMIT.PRO_TIER
        : QUOTA.RATE_LIMIT.FREE_TIER;
      
      // Get current timestamp
      const now = new Date();
      
      // Calculate rate limit window (1 minute)
      const windowStart = new Date(now);
      windowStart.setMinutes(windowStart.getMinutes() - 1);
      
      // Calculate next reset time (start of next minute)
      const resetAt = new Date(now);
      resetAt.setMinutes(resetAt.getMinutes() + 1);
      resetAt.setSeconds(0);
      resetAt.setMilliseconds(0);
      
      // Count requests in the current window
      const { count, error } = await this.supabase
        .from('video_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', windowStart.toISOString());
      
      if (error) {
        logger.error(`Error checking rate limit for user ${userId}:`, error);
        // Allow the request in case of error to avoid blocking legitimate requests
        return {
          allowed: true,
          limit: rateLimit,
          remaining: rateLimit,
          resetAt,
        };
      }
      
      const requestCount = count || 0;
      const remaining = Math.max(0, rateLimit - requestCount);
      const allowed = requestCount < rateLimit;
      
      return {
        allowed,
        limit: rateLimit,
        remaining,
        resetAt,
      };
    } catch (error) {
      logger.error(`Error in rate limiting for user ${userId}:`, error);
      // Allow the request in case of error
      return {
        allowed: true,
        limit: userTier === 'pro' ? QUOTA.RATE_LIMIT.PRO_TIER : QUOTA.RATE_LIMIT.FREE_TIER,
        remaining: userTier === 'pro' ? QUOTA.RATE_LIMIT.PRO_TIER : QUOTA.RATE_LIMIT.FREE_TIER,
        resetAt: new Date(new Date().getTime() + 60000), // 1 minute from now
      };
    }
  }

  /**
   * Check if a user has exceeded their monthly quota
   */
  async checkMonthlyQuota(
    userId: string,
    userTier: 'free' | 'pro' = 'free'
  ): Promise<{
    allowed: boolean;
    limit: number;
    used: number;
    remaining: number;
  }> {
    try {
      // Determine monthly limit based on user tier
      const monthlyLimit = userTier === 'pro'
        ? QUOTA.PRO_TIER.MAX_VIDEOS
        : QUOTA.FREE_TIER.MAX_VIDEOS;
      
      // Get current year and month
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JavaScript months are 0-indexed
      
      // Check if we have a record for this month
      const { data, error } = await this.supabase
        .from('monthly_usage')
        .select('jobs_count')
        .eq('user_id', userId)
        .eq('year', year)
        .eq('month', month)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "Not found" error
        logger.error(`Error checking monthly quota for user ${userId}:`, error);
        // Allow the request in case of error
        return {
          allowed: true,
          limit: monthlyLimit,
          used: 0,
          remaining: monthlyLimit,
        };
      }
      
      const usedCount = data?.jobs_count || 0;
      const remaining = Math.max(0, monthlyLimit - usedCount);
      const allowed = usedCount < monthlyLimit;
      
      return {
        allowed,
        limit: monthlyLimit,
        used: usedCount,
        remaining,
      };
    } catch (error) {
      logger.error(`Error checking monthly quota for user ${userId}:`, error);
      // Allow the request in case of error
      return {
        allowed: true,
        limit: userTier === 'pro' ? QUOTA.PRO_TIER.MAX_VIDEOS : QUOTA.FREE_TIER.MAX_VIDEOS,
        used: 0,
        remaining: userTier === 'pro' ? QUOTA.PRO_TIER.MAX_VIDEOS : QUOTA.FREE_TIER.MAX_VIDEOS,
      };
    }
  }

  /**
   * Increment monthly usage counter for a user
   */
  async incrementMonthlyUsage(
    userId: string,
    videoDurationSeconds: number
  ): Promise<boolean> {
    try {
      // Get current year and month
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JavaScript months are 0-indexed
      
      // Try to update an existing record first
      const { data, error } = await this.supabase
        .from('monthly_usage')
        .update({
          jobs_count: this.supabase.rpc('increment', { count: 1 }),
          total_seconds: this.supabase.rpc('increment', { count: videoDurationSeconds }),
          updated_at: now.toISOString(),
        })
        .eq('user_id', userId)
        .eq('year', year)
        .eq('month', month)
        .select();
      
      if (error || !data || data.length === 0) {
        // No existing record, create a new one
        const { error: insertError } = await this.supabase
          .from('monthly_usage')
          .insert({
            user_id: userId,
            year,
            month,
            jobs_count: 1,
            total_seconds: videoDurationSeconds,
            updated_at: now.toISOString(),
          });
        
        if (insertError) {
          throw insertError;
        }
      }
      
      return true;
    } catch (error) {
      logger.error(`Error incrementing monthly usage for user ${userId}:`, error);
      return false;
    }
  }
}