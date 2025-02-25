
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "failed";
  priority: string;
  task_type: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export class TaskManager {
  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...task,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Cast the status to the correct type since we know our database constraints ensure it's valid
      return data ? { ...data, status: data.status as Task['status'] } : null;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'created_at'>>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      // Cast the status to the correct type since we know our database constraints ensure it's valid
      return data ? { ...data, status: data.status as Task['status'] } : null;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  async getTasks(filters?: { status?: Task['status']; type?: string }): Promise<Task[]> {
    try {
      let query = supabase.from('tasks').select('*');
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.type) {
        query = query.eq('task_type', filters.type);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Cast the status to the correct type since we know our database constraints ensure it's valid
      return data ? data.map(task => ({ ...task, status: task.status as Task['status'] })) : [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  async markTaskCompleted(taskId: string): Promise<Task | null> {
    return this.updateTask(taskId, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
  }

  async markTaskFailed(taskId: string): Promise<Task | null> {
    return this.updateTask(taskId, {
      status: 'failed'
    });
  }
}
