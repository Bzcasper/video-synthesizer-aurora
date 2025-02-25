
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  task_type?: string;
  description?: string;
  completed_at?: string | null;
}

export class TaskManager {
  async createTask(task: Omit<Task, 'id' | 'status'>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...task,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  async completeTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      return false;
    }
  }

  async getPendingTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
      return [];
    }
  }

  async updateTaskStatus(taskId: string, status: Task['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  }
}

export default new TaskManager();
