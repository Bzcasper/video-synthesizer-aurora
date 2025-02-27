
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Video } from "@/hooks/video/types";

/**
 * Hook to fetch videos from Supabase
 * 
 * @returns Query result containing videos data, loading state, and error
 */
export function useFetchVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_jobs')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading videos",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      return data as Video[];
    }
  });
}
