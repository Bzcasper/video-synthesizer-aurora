
import { createClient } from '@supabase/supabase-js';
import { DB_TABLES } from '../config/constants';
import { logger } from '../utils/logging';
import { VideoJob } from './VideoGenerator';

export class QueueStats {
  constructor(
    private supabase: ReturnType<typeof createClient>
  ) {}

  async getQueueStats(): Promise<{
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    failedJobs: number;
  }> {
    try {
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
      return {
        pendingJobs: 0,
        processingJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
      };
    }
  }

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
}
