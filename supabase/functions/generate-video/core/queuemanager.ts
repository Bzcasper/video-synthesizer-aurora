
import { createClient } from '@supabase/supabase-js';
import { SYSTEM, DB_TABLES } from '../config/constants';
import { VideoGenerator } from './video-generator';
import { ErrorHandler } from './errorhandler';
import { JobValidator } from './job-validator';
import { JobStatusManager } from './job-status-manager';
import { QueueStats } from './queue-stats';
import { logger } from '../utils/logging';
import { VideoJob } from './types';

export interface JobPriority {
  level: 'low' | 'normal' | 'high';
  weight: number;
}

export class QueueManager {
  private jobValidator: JobValidator;
  private jobStatusManager: JobStatusManager;
  private queueStats: QueueStats;
  private activeJobs: Map<string, NodeJS.Timeout>;
  private isProcessing: boolean;
  
  constructor(
    private supabase: ReturnType<typeof createClient>,
    private videoGenerator: VideoGenerator,
    private errorHandler: ErrorHandler
  ) {
    this.jobValidator = new JobValidator(supabase, errorHandler);
    this.jobStatusManager = new JobStatusManager(supabase, errorHandler);
    this.queueStats = new QueueStats(supabase);
    this.activeJobs = new Map();
    this.isProcessing = false;
  }
  
  async addJob(job: Omit<VideoJob, 'id' | 'createdAt' | 'status' | 'progress'>): Promise<string> {
    logger.info(`Adding new job for user ${job.userId}`);
    
    try {
      await this.jobValidator.checkUserLimits(job.userId);
      
      const jobRecord = {
        user_id: job.userId,
        prompt: job.prompt,
        settings: job.settings,
        created_at: new Date().toISOString(),
        status: 'pending',
        progress: 0,
      };
      
      const { data, error } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .insert(jobRecord)
        .select()
        .single();
        
      if (error) {
        throw this.errorHandler.wrapError(error, 'Failed to add job to queue');
      }
      
      const jobId = data.id;
      
      await this.jobValidator.updateMonthlyUsage(job.userId);
      
      if (!this.isProcessing) {
        setTimeout(() => this.processQueue(), 0);
      }
      
      logger.info(`Successfully added job ${jobId} to queue`);
      
      return jobId;
    } catch (error) {
      logger.error('Error adding job to queue:', error);
      throw this.errorHandler.wrapError(error, 'Failed to add job to queue');
    }
  }
  
  private async processQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      logger.info('Starting queue processing');
      
      while (this.activeJobs.size < SYSTEM.MAX_CONCURRENT_JOBS) {
        const job = await this.jobStatusManager.getNextJob();
        
        if (!job) {
          logger.info('No more jobs in queue');
          break;
        }
        
        this.processJob(job);
      }
      
      logger.info('Queue processing completed');
    } catch (error) {
      logger.error('Error processing queue:', error);
    } finally {
      this.isProcessing = false;
      
      const { count } = await this.supabase
        .from(DB_TABLES.VIDEO_JOBS)
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (count && count > 0 && this.activeJobs.size < SYSTEM.MAX_CONCURRENT_JOBS) {
        setTimeout(() => this.processQueue(), 5000);
      }
    }
  }
  
  private async processJob(job: VideoJob): Promise<void> {
    logger.info(`Processing job ${job.id}`);
    
    const timeout = setTimeout(() => {
      this.handleJobTimeout(job.id);
    }, SYSTEM.JOB_TIMEOUT);
    
    this.activeJobs.set(job.id, timeout);
    
    try {
      await this.jobStatusManager.updateJobStatus(job.id, 'processing');
      
      const result = await this.videoGenerator.generateVideo(job);
      
      await this.jobStatusManager.updateJobCompletion(job.id, result.videoUrl, result.thumbnailUrl);
      
      logger.info(`Job ${job.id} completed successfully`);
    } catch (error) {
      logger.error(`Error processing job ${job.id}:`, error);
      
      await this.jobStatusManager.updateJobFailure(
        job.id,
        error instanceof Error ? error.message : 'Unknown error'
      );
    } finally {
      clearTimeout(timeout);
      this.activeJobs.delete(job.id);
      
      setTimeout(() => this.processQueue(), 1000);
    }
  }
  
  private async handleJobTimeout(jobId: string): Promise<void> {
    logger.warn(`Job ${jobId} timed out after ${SYSTEM.JOB_TIMEOUT / 1000} seconds`);
    
    this.activeJobs.delete(jobId);
    
    await this.jobStatusManager.updateJobFailure(
      jobId,
      `Job timed out after ${SYSTEM.JOB_TIMEOUT / 1000} seconds`
    );
    
    setTimeout(() => this.processQueue(), 1000);
  }
  
  async cancelJob(jobId: string): Promise<boolean> {
    logger.info(`Attempting to cancel job ${jobId}`);
    
    try {
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
      
      await this.jobStatusManager.updateJobFailure(jobId, 'Job canceled by user');
      
      logger.info(`Successfully canceled job ${jobId}`);
      
      return true;
    } catch (error) {
      logger.error(`Error canceling job ${jobId}:`, error);
      return false;
    }
  }
  
  async restartJob(jobId: string): Promise<boolean> {
    logger.info(`Attempting to restart job ${jobId}`);
    
    try {
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
      
      await this.jobStatusManager.updateJobStatus(jobId, 'pending');
      
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
  
  async getQueueStats() {
    return this.queueStats.getQueueStats();
  }
}
