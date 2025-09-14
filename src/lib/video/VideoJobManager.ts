import { supabase } from "@/integrations/supabase/client";

export class VideoJobManager {
  static async createVideoJob(
    userId: string,
    prompt: string,
    duration: number,
    resolution: any,
  ) {
    try {
      const { data: task, error } = await supabase
        .from("tasks")
        .insert({
          user_id: userId,
          title: "Video Generation",
          description: prompt,
          task_type: "video_generation",
          status: "pending",
          metadata: {
            prompt,
            duration,
            resolution,
          },
        })
        .select()
        .single();

      if (error) throw error;
      return task;
    } catch (error) {
      console.error("Error creating video job:", error);
      throw error;
    }
  }

  static async getVideoJobStatus(taskId: string) {
    try {
      const { data: task, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error) throw error;
      return task;
    } catch (error) {
      console.error("Error fetching job status:", error);
      throw error;
    }
  }
}
