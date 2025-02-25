
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskStatus = Database['public']['Enums']['task_status'];

export class TaskManager {
  static async getTasks(userId: string, status?: TaskStatus) {
    try {
      const query = supabase
        .from('tasks')
        .select('id, task_type, status, completed_at, created_at, user_id');

      if (status) {
        query.eq('status', status);
      }

      const { data, error } = await query
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }

      return data as Task[];
    } catch (error) {
      console.error('Error in getTasks:', error);
      return [];
    }
  }
}
