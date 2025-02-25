
import { supabase } from "@/integrations/supabase/client";
import { type Database } from "@/integrations/supabase/types";

export type VideoOptions = {
  duration: number;
  style: string;
  resolution: { width: number; height: number };
};

export class VideoJobManager {
  async createJob(userId: string, prompt: string, options: VideoOptions) {
    try {
      const { data: job, error } = await supabase
        .from('video_jobs')
        .insert([{
          user_id: userId,
          prompt,
          duration: options.duration,
          style: options.style,
          resolution: options.resolution,
          status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      // Create a task to track this job
      await supabase
        .from('tasks')
        .insert([{
          user_id: userId,
          title: 'Video Generation',
          description: prompt,
          task_type: 'video_generation',
          metadata: { job_id: job.id },
        }]);

      return job;
    } catch (error) {
      console.error('Error creating video job:', error);
      throw error;
    }
  }

  async checkJobStatus(jobId: string) {
    try {
      const { data: job, error } = await supabase
        .from('video_jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();

      if (error) throw error;
      return job;
    } catch (error) {
      console.error('Error checking job status:', error);
      throw error;
    }
  }

  async storeFinalVideo(jobId: string, videoUrl: string) {
    try {
      const { error: jobError } = await supabase
        .from('video_jobs')
        .update({
          status: 'completed',
          output_url: videoUrl,
          processing_completed_at: new Date().toISOString(),
        })
        .eq('id', jobId);

      if (jobError) throw jobError;

      // Update the corresponding task
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('metadata->job_id', jobId);

      if (taskError) throw taskError;
    } catch (error) {
      console.error('Error storing final video:', error);
      throw error;
    }
  }
}
