
import { supabase } from "@/integrations/supabase/client";
import { type Database } from "@/integrations/supabase/types";

type FilterType = Database["public"]["Enums"]["video_filter_type"];

export class VideoEditor {
  async applyTrim(videoId: string, userId: string, start: number, end: number) {
    try {
      const { data: edit, error } = await supabase
        .from('video_edits')
        .insert([{
          user_id: userId,
          original_video_id: videoId,
          operation: 'trim',
          parameters: { start, end },
          status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      // Create a task to track this edit
      await supabase
        .from('tasks')
        .insert([{
          user_id: userId,
          title: 'Video Trim',
          description: `Trimming video from ${start}s to ${end}s`,
          task_type: 'video_edit',
          metadata: { edit_id: edit.id, operation: 'trim' },
        }]);

      return edit;
    } catch (error) {
      console.error('Error creating trim edit:', error);
      throw error;
    }
  }

  async applyFilter(videoId: string, userId: string, filter: FilterType) {
    try {
      const { data: edit, error } = await supabase
        .from('video_edits')
        .insert([{
          user_id: userId,
          original_video_id: videoId,
          operation: 'filter',
          parameters: { filter },
          status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      // Create a task to track this edit
      await supabase
        .from('tasks')
        .insert([{
          user_id: userId,
          title: 'Video Filter',
          description: `Applying ${filter} filter`,
          task_type: 'video_edit',
          metadata: { edit_id: edit.id, operation: 'filter' },
        }]);

      return edit;
    } catch (error) {
      console.error('Error creating filter edit:', error);
      throw error;
    }
  }
}
