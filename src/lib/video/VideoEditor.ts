
import { supabase } from "@/integrations/supabase/client";
import { VideoEditOperation } from "@/types/video";

export class VideoEditor {
  static async submitEdit(videoId: string, userId: string, operation: VideoEditOperation, parameters: any) {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: `Video Edit - ${operation}`,
          description: `Edit operation ${operation} for video ${videoId}`,
          task_type: 'video_edit',
          status: 'pending',
          metadata: {
            video_id: videoId,
            operation,
            parameters
          }
        })
        .select()
        .single();

      if (error) throw error;
      return task;
    } catch (error) {
      console.error('Error submitting video edit:', error);
      throw error;
    }
  }

  static async getVideoEditStatus(taskId: string) {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return task;
    } catch (error) {
      console.error('Error getting edit status:', error);
      throw error;
    }
  }
}
