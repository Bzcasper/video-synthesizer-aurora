
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskStatus = Database['public']['Enums']['task_status'];

export class TaskManager {
  static async getTasks(userId: string, status?: TaskStatus) {
    try {
      let query = supabase
        .from('tasks')
        .select('id, task_type, status, completed_at, created_at, user_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  static async updateTaskStatus(taskId: string, status: TaskStatus) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }
}
