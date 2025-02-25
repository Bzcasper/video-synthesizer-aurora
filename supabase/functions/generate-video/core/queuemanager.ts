// supabase/functions/generate-video/core/QueueManager.ts

import { createClient } from '@supabase/supabase-js';
import { SYSTEM, DB_TABLES, QUOTA } from '../config/constants';
import { VideoGenerator, VideoJob } from './VideoGenerator';
import { ErrorHandler } from './ErrorHandler';
import { logger } from '../utils/logging';

/**
 * Interface for job priority options
 */
export interface JobPriority {
  level: 'low' | 'normal' | 'high';
  weight: number;
}

/**
 * Class for managing video generation job queue
 */
export class QueueManager {
  private supabase: ReturnType<typeof createClient>;
  private videoGenerator: VideoGenerator;
  private errorHandler: ErrorHandler;
  private activeJobs: Map<string, NodeJS.Timeout>;
  private isProcessing: boolean;
  
  /**
   * Creates a new QueueManager instance
   * @param supabaseClient Initialized Supabase client
   * @param videoGenerator VideoGenerator instance
   * @param errorHandler ErrorHandler instance
   */
  constructor(
    supabaseClient: ReturnType<typeof createClient>,
    videoGenerator: VideoGenerator,
    errorHandler: ErrorHandler
  ) {
    this.supabase = supabaseClient;
    this.videoGenerator = videoGenerator;
    this.errorHandler = errorHandler;
    this.activeJobs = new Map();
    this.isProcessing = false;
  }
  
  /**
   * Add a new job to the queue
   * @param job Video generation job
   * @returns Job ID
   */
  async addJob(job: Omit<VideoJob, 'id' | 'createdAt' | 'status' | 'progress'>): Promise<string> {
    logger.info(`Adding new job for user ${job.userId}`);
    
    try {
      // Check monthly usage limits for the user
      await this.checkUserLimits(job.userId);
      
      // Prepare job record
      const jobRecord = {
        user_id: job.userId,
        prompt: job.prompt,
        settings: job.settings,
        created_at: new Date().toISOString(),
        status: 'pending',
        progress: 0,
      };
      
      // Insert job into database
      const { data, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .insert(jobRecord)
        .select()
        .single();
        
      if (error) {
        throw this.errorHandler.wrapError(error, 'Failed to add job to queue');
      }
      
      const jobId = data.id;
      
      // Update monthly usage statistics
      await this.updateMonthlyUsage(job.userId);
      
      // Start queue processing if not already running
      if (!this.isProcessing) {
        // Use setTimeout to avoid blocking the current execution
        setTimeout(() => this.processQueue(), 0);
      }
      
      logger.info(`Successfully added job ${jobId} to queue`);
      
      return jobId;
    } catch (error) {
      logger.error('Error adding job to queue:', error);
      throw this.errorHandler.wrapError(error, 'Failed to add job to queue');
    }
  }
  
  /**
   * Process the job queue
   * @private
   */
  private async processQueue(): Promise<void> {
    // Prevent multiple concurrent queue processing
    if (this.isProcessing) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      logger.info('Starting queue processing');
      
      // While there are available slots and pending jobs
      while (this.activeJobs.size < SYSTEM.MAX_CONCURRENT_JOBS) {
        // Get the next job from the queue
        const job = await this.getNextJob();
        
        if (!job) {
          logger.info('No more jobs in queue');
          break;
        }
        
        // Process the job
        this.processJob(job);
      }
      
      logger.info('Queue processing completed');
    } catch (error) {
      logger.error('Error processing queue:', error);
    } finally {
      this.isProcessing = false;
      
      // If there are still pending jobs, schedule another processing run
      const { count } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (count && count > 0 && this.activeJobs.size < SYSTEM.MAX_CONCURRENT_JOBS) {
        setTimeout(() => this.processQueue(), 5000); // Wait 5 seconds before checking again
      }
    }
  }
  
  /**
   * Get the next job from the queue based on priority
   * @returns Next job to process, or null if no jobs are available
   * @private
   */
  private async getNextJob(): Promise<VideoJob | null> {
    try {
      // Get the next pending job, ordered by priority
      // Here we would include logic for prioritizing jobs (e.g., based on user tier, job age)
      const { data, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No jobs found
          return null;
        }
        
        throw this.errorHandler.wrapError(error, 'Failed to get next job from queue');
      }
      
      if (!data) {
        return null;
      }
      
      // Convert database record to VideoJob
      const job: VideoJob = {
        id: data.id,
        userId: data.user_id,
        prompt: data.prompt,
        settings: data.settings,
        createdAt: new Date(data.created_at),
        status: data.status,
        progress: data.progress,
        error: data.error,
        outputUrl: data.output_url,
        thumbnailUrl: data.thumbnail_url
      };
      
      return job;
    } catch (error) {
      logger.error('Error getting next job from queue:', error);
      return null;
    }
  }
  
  /**
   * Process a video generation job
   * @param job Job to process
   * @private
   */
  private async processJob(job: VideoJob): Promise<void> {
    logger.info(`Processing job ${job.id}`);
    
    // Set up a timeout to prevent jobs from running too long
    const timeout = setTimeout(() => {
      this.handleJobTimeout(job.id);
    }, SYSTEM.JOB_TIMEOUT);
    
    // Add job to active jobs map
    this.activeJobs.set(job.id, timeout);
    
    try {
      // Update job status to processing
      await this.updateJobStatus(job.id, 'processing');
      
      // Generate the video
      const result = await this.videoGenerator.generateVideo(job);
      
      // Update job record with results
      await this.updateJobCompletion(job.id, result.videoUrl, result.thumbnailUrl);
      
      logger.info(`Job ${job.id} completed successfully`);
    } catch (error) {
      // Handle job failure
      logger.error(`Error processing job ${job.id}:`, error);
      
      await this.updateJobFailure(job.id, error instanceof Error ? error.message : 'Unknown error');
    } finally {
      // Clear the timeout and remove from active jobs
      clearTimeout(timeout);
      this.activeJobs.delete(job.id);
      
      // Check if there are more jobs to process
      setTimeout(() => this.processQueue(), 1000);
    }
  }
  
  /**
   * Handle a job timeout
   * @param jobId ID of the job that timed out
   * @private
   */
  private async handleJobTimeout(jobId: string): Promise<void> {
    logger.warn(`Job ${jobId} timed out after ${SYSTEM.JOB_TIMEOUT / 1000} seconds`);
    
    // Remove from active jobs
    this.activeJobs.delete(jobId);
    
    // Update job status to failed
    await this.updateJobFailure(jobId, `Job timed out after ${SYSTEM.JOB_TIMEOUT / 1000} seconds`);
    
    // Check if there are more jobs to process
    setTimeout(() => this.processQueue(), 1000);
  }
  
  /**
   * Cancel a job if it's still pending
   * @param jobId ID of the job to cancel
   * @returns True if the job was canceled, false otherwise
   */
  async cancelJob(jobId: string): Promise<boolean> {
    logger.info(`Attempting to cancel job ${jobId}`);
    
    try {
      // Check if the job is still pending
      const { data, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select('status')
        .eq('id', jobId)
        .single();
        
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to check status for job ${jobId}`);
      }
      
      if (data.status !== 'pending') {
        logger.info(`Cannot cancel job ${jobId}, status is ${data.status}`);
        return false;
      }
      
      // Update job status to failed with cancellation message
      await this.updateJobFailure(jobId, 'Job canceled by user');
      
      logger.info(`Successfully canceled job ${jobId}`);
      
      return true;
    } catch (error) {
      logger.error(`Error canceling job ${jobId}:`, error);
      return false;
    }
  }
  
  /**
   * Update job status in the database
   * @param jobId Job ID
   * @param status New status
   * @private
   */
  private async updateJobStatus(jobId: string, status: VideoJob['status']): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', jobId);
        
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to update status for job ${jobId}`);
      }
    } catch (error) {
      logger.error(`Error updating status for job ${jobId}:`, error);
      // Log error but don't throw to avoid failing the processing chain
    }
  }
  
  /**
   * Update job record on successful completion
   * @param jobId Job ID
   * @param videoUrl URL of the generated video
   * @param thumbnailUrl URL of the generated thumbnail
   * @private
   */
  private async updateJobCompletion(jobId: string, videoUrl: string, thumbnailUrl: string): Promise<void> {
    try {
      const updateData = {
        status: 'completed',
        progress: 100,
        output_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update(updateData)
        .eq('id', jobId);
        
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to update completion for job ${jobId}`);
      }
    } catch (error) {
      logger.error(`Error updating completion for job ${jobId}:`, error);
      // Log error but don't throw to avoid failing the processing chain
    }
  }
  
  /**
   * Update job record on failure
   * @param jobId Job ID
   * @param errorMessage Error message
   * @private
   */
  private async updateJobFailure(jobId: string, errorMessage: string): Promise<void> {
    try {
      const updateData = {
        status: 'failed',
        error: errorMessage,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update(updateData)
        .eq('id', jobId);
        
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to update failure for job ${jobId}`);
      }
    } catch (error) {
      logger.error(`Error updating failure for job ${jobId}:`, error);
      // Log error but don't throw to avoid failing the processing chain
    }
  }
  
  /**
   * Check if a user has reached their monthly limits
   * @param userId User ID
   * @throws Error if user has reached their monthly limits
   * @private
   */
  private async checkUserLimits(userId: string): Promise<void> {
    try {
      // Get current month's usage for the user
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      const { data, error } = await this.supabase
        .from(DB_TABLES.MONTHLY_USAGE)
        .select('video_count, user_tier')
        .eq('user_id', userId)
        .eq('year', year)
        .eq('month', month)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no data found, which is fine for new users
        throw this.errorHandler.wrapError(error, `Failed to check monthly usage for user ${userId}`);
      }
      
      // If no usage record found, user is within limits
      if (!data) {
        return;
      }
      
      // Check if user has reached their limit based on tier
      const tierLimits = data.user_tier === 'pro' 
        ? QUOTA.PRO_TIER.MAX_VIDEOS 
        : QUOTA.FREE_TIER.MAX_VIDEOS;
        
      if (data.video_count >= tierLimits) {
        throw new Error(`User ${userId} has reached their monthly limit of ${tierLimits} videos`);
      }
    } catch (error) {
      logger.error(`Error checking monthly usage for user ${userId}:`, error);
      
      if (error instanceof Error && error.message.includes('has reached their monthly limit')) {
        throw error; // Re-throw limit errors
      }
      
      // For other errors, assume user is within limits and continue
      logger.warn(`Continuing despite error checking monthly usage for user ${userId}`);
    }
  }
  
  /**
   * Update monthly usage statistics for a user
   * @param userId User ID
   * @private
   */
  private async updateMonthlyUsage(userId: string): Promise<void> {
    try {
      // Get current month
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      // Get user tier from database or set default
      let userTier = 'free';
      
      // Try to get the user's tier from a user table
      try {
        const { data, error } = await this.supabase
          .from('users') // Assuming there's a users table with tier information
          .select('tier')
          .eq('id', userId)
          .single();
          
        if (!error && data) {
          userTier = data.tier;
        }
      } catch (error) {
        logger.warn(`Error getting user tier for ${userId}, defaulting to 'free':`, error);
      }
      
      // Try to update existing monthly usage record
      const { data, error } = await this.supabase
        .from(DB_TABLES.MONTHLY_USAGE)
        .update({
          video_count: this.supabase.rpc('increment'),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('year', year)
        .eq('month', month)
        .select();
        
      // If record doesn't exist, create it
      if (error || !data || data.length === 0) {
        await this.supabase
          .from(DB_TABLES.MONTHLY_USAGE)
          .insert({
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
      // Log error but don't throw to avoid failing the job submission
    }
  }
  
  /**
   * Get an overview of jobs in the queue
   * @returns Job queue statistics
   */
  async getQueueStats(): Promise<{
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    failedJobs: number;
  }> {
    try {
      // Get counts for each status
      const pendingCount = await this.getJobCountByStatus('pending');
      const processingCount = await this.getJobCountByStatus('processing');
      const completedCount = await this.getJobCountByStatus('completed');
      const failedCount = await this.getJobCountByStatus('failed');
      
      return {
        pendingJobs: pendingCount,
        processingJobs: processingCount,
        completedJobs: completedCount,
        failedJobs: failedCount,
      };
    } catch (error) {
      logger.error('Error getting queue stats:', error);
      
      // Return zeros if there's an error
      return {
        pendingJobs: 0,
        processingJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
      };
    }
  }
  
  /**
   * Get the count of jobs with a specific status
   * @param status Job status
   * @returns Count of jobs
   * @private
   */
  private async getJobCountByStatus(status: VideoJob['status']): Promise<number> {
    const { count, error } = await this.supabase
      .from(DB_TABLES.VIDEO_JOBS)
      .select('id', { count: 'exact', head: true })
      .eq('status', status);
      
    if (error) {
      logger.error(`Error getting count for ${status} jobs:`, error);
      return 0;
    }
    
    return count || 0;
  }
  
  /**
   * Restart a failed job
   * @param jobId ID of the job to restart
   * @returns True if the job was restarted, false otherwise
   */
  async restartJob(jobId: string): Promise<boolean> {
    logger.info(`Attempting to restart job ${jobId}`);
    
    try {
      // Check if the job exists and is in a failed state
      const { data, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select('*')
        .eq('id', jobId)
        .single();
        
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to find job ${jobId}`);
      }
      
      if (data.status !== 'failed') {
        logger.info(`Cannot restart job ${jobId}, status is ${data.status}`);
        return false;
      }
      
      // Update job status to pending and reset error and progress
      const updateData = {
        status: 'pending',
        error: null,
        progress: 0,
        updated_at: new Date().toISOString(),
      };
      
      const { error: updateError } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .update(updateData)
        .eq('id', jobId);
        
      if (updateError) {
        throw this.errorHandler.wrapError(updateError, `Failed to update job ${jobId} for restart`);
      }
      
      // Start queue processing if not already running
      if (!this.isProcessing) {
        setTimeout(() => this.processQueue(), 0);
      }
      
      logger.info(`Successfully restarted job ${jobId}`);
      
      return true;
    } catch (error) {
      logger.error(`Error restarting job ${jobId}:`, error);
      return false;
    }
  }
}
