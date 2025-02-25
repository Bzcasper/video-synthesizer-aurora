
import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logging';

export class MonitoringService {
  constructor(private supabase: ReturnType<typeof createClient>) {}

  async trackMetric(
    metricName: string,
    value: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await this.supabase
        .from('metrics')
        .insert({
          name: metricName,
          value,
          timestamp: new Date().toISOString(),
          metadata
        });
    } catch (error) {
      logger.error(`Error tracking metric ${metricName}:`, error);
    }
  }

  async trackError(
    error: Error,
    context: Record<string, any> = {}
  ): Promise<void> {
    try {
      await this.supabase
        .from('error_logs')
        .insert({
          error_message: error.message,
          error_stack: error.stack,
          context,
          timestamp: new Date().toISOString()
        });
    } catch (err) {
      logger.error('Error logging error:', err);
    }
  }

  async getSystemStatus(): Promise<{
    activeJobs: number;
    queuedJobs: number;
    avgProcessingTime: number;
    errorRate: number;
  }> {
    try {
      const { data: jobStats } = await this.supabase
        .from('video_jobs')
        .select('status')
        .in('status', ['processing', 'pending']);

      const active = jobStats?.filter(j => j.status === 'processing').length || 0;
      const queued = jobStats?.filter(j => j.status === 'pending').length || 0;

      // Calculate average processing time from completed jobs in last hour
      const { data: completedJobs } = await this.supabase
        .from('video_jobs')
        .select('created_at, completed_at')
        .eq('status', 'completed')
        .gte('completed_at', new Date(Date.now() - 3600000).toISOString());

      let avgTime = 0;
      if (completedJobs && completedJobs.length > 0) {
        avgTime = completedJobs.reduce((acc, job) => {
          const duration = new Date(job.completed_at).getTime() - new Date(job.created_at).getTime();
          return acc + duration;
        }, 0) / completedJobs.length;
      }

      // Calculate error rate from last 100 jobs
      const { data: recentJobs } = await this.supabase
        .from('video_jobs')
        .select('status')
        .order('created_at', { ascending: false })
        .limit(100);

      const errorRate = recentJobs 
        ? recentJobs.filter(j => j.status === 'failed').length / recentJobs.length
        : 0;

      return {
        activeJobs: active,
        queuedJobs: queued,
        avgProcessingTime: avgTime,
        errorRate
      };
    } catch (error) {
      logger.error('Error getting system status:', error);
      throw error;
    }
  }
}
