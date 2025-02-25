
import { supabase } from "@/integrations/supabase/client";
import { VideoEditOperation, EditParameters } from "@/types/video";
import { Database } from "@/integrations/supabase/types";

type Json = Database['public']['CompositeTypes']['json'];

export class VideoEditor {
  static async submitEdit(videoId: string, userId: string, operation: VideoEditOperation, parameters: EditParameters) {
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
            parameters: parameters as unknown as Json
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
