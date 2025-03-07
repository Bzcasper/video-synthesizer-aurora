
import { supabase } from "@/integrations/supabase/client";
import { VideoEditOperation, EditParameters } from "@/types/video";
import { Database } from "@/integrations/supabase/types";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export class VideoEditor {
  static async submitEdit(videoId: string, userId: string, operation: VideoEditOperation, parameters: EditParameters) {
    try {
      // Convert parameters to a JSON-safe format
      const safeParameters = JSON.parse(JSON.stringify(parameters));
      
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: `Video Edit - ${operation}`,
          task_type: 'video_edit',
          status: 'pending',
          metadata: {
            video_id: videoId,
            operation,
            parameters: safeParameters
          } as Json
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
