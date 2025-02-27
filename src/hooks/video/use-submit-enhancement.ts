
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Enhancement, EnhancementProgress, FilterType } from './types';

/**
 * Hook to handle enhancement submission
 * 
 * @param setEnhancementProgress Function to update the enhancement progress
 * @returns Functions and state for enhancement submission
 */
export function useSubmitEnhancement(
  setEnhancementProgress: React.Dispatch<React.SetStateAction<Record<string, EnhancementProgress>>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitEnhancement = async (
    selectedVideo: string | null, 
    selectedEnhancement: Enhancement | null,
    selectedFilter: FilterType,
    speedFactor: number
  ) => {
    if (!selectedVideo || !selectedEnhancement) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('video_enhancements')
        .insert({
          video_id: selectedVideo,
          enhancement_type: selectedEnhancement.id,
          filter_type: selectedEnhancement.id === 'filter' ? selectedFilter : null,
          speed_factor: selectedEnhancement.id === 'speed_adjustment' ? speedFactor : null,
          status: 'pending',
          progress: 0,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Enhancement submitted",
        description: "Your video enhancement is being processed. You'll see progress updates in real-time.",
      });

      if (data) {
        setEnhancementProgress(prev => ({
          ...prev,
          [data.id]: {
            id: data.id,
            progress: 0,
            status: 'pending',
            estimated_completion_time: null
          }
        }));
      }
    } catch (error: any) {
      toast({
        title: "Error submitting enhancement",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
    
    return true;
  };

  return { isSubmitting, handleSubmitEnhancement };
}
