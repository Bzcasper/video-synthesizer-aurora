
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define interfaces for type safety
export interface Metrics {
  processingTime: number;
  gpuUtilization: number;
  queueLength: number;
  successRate: number;
}

interface MetricMetadata {
  gpu_utilization?: number;
  queue_length?: number;
  success_rate?: number;
}

export interface VideoJobMetrics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
}

// Utility functions for metrics tracking
export const trackMetric = async (name: string, value: number, metadata: Record<string, unknown> = {}) => {
  try {
    await supabase.from('metrics').insert({
      name,
      value,
      metadata
    });
  } catch (error) {
    console.error('Error tracking metric:', error);
  }
};

export const logError = async (error: Error, context: Record<string, unknown> = {}) => {
  try {
    await supabase.from('error_logs').insert({
      error_message: error.message,
      error_stack: error.stack,
      context
    });
  } catch (err) {
    console.error('Error logging error:', err);
  }
};

export const createNotification = async (userId: string, jobId: string, type: string, message: string, metadata: Record<string, unknown> = {}) => {
  try {
    await supabase.from('notifications').insert({
      user_id: userId,
      job_id: jobId,
      type,
      message,
      metadata
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Dashboard metrics functions
export const fetchVideoMetrics = async (): Promise<VideoJobMetrics> => {
  try {
    const { data: videoJobs, error } = await supabase
      .from('video_jobs')
      .select('status, processing_time');

    if (error) throw error;

    const metrics: VideoJobMetrics = {
      totalJobs: videoJobs?.length || 0,
      completedJobs: videoJobs?.filter(job => job.status === 'completed').length || 0,
      failedJobs: videoJobs?.filter(job => job.status === 'failed').length || 0,
      averageProcessingTime: videoJobs?.reduce((acc, job) => acc + (job.processing_time || 0), 0) / (videoJobs?.length || 1)
    };

    return metrics;
  } catch (error) {
    logError(error as Error, { context: 'fetchVideoMetrics' });
    throw error;
  }
};

// System metrics functions
export const fetchSystemMetrics = async (timeRange: string = '1h'): Promise<Metrics[]> => {
  try {
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .gte('timestamp', new Date(Date.now() - getTimeRangeInMs(timeRange)))
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return data.map(metric => {
      const metadata = metric.metadata as MetricMetadata;
      return {
        processingTime: metric.value,
        gpuUtilization: metadata?.gpu_utilization ?? 0,
        queueLength: metadata?.queue_length ?? 0,
        successRate: metadata?.success_rate ?? 0
      };
    });
  } catch (error) {
    logError(error as Error, { context: 'fetchSystemMetrics' });
    throw error;
  }
};

// Notifications functions
export const fetchUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;

    toast.success('Notification marked as read');
  } catch (error) {
    console.error('Error marking notification as read:', error);
    toast.error('Failed to mark notification as read');
  }
};

// Helper functions
const getTimeRangeInMs = (range: string): number => {
  const ranges: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };
  return ranges[range] || ranges['1h'];
};

export const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
