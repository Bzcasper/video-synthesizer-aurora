
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
type EnhancementType = Database["public"]["Enums"]["video_enhancement_type"];
type FilterType = Database["public"]["Enums"]["video_filter_type"];

export interface Video {
  id: string;
  output_url: string | null;
  created_at: string | null;
  prompt: string;
  status: VideoJobStatus;
}

export interface Enhancement {
  id: EnhancementType;
  label: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

export interface EnhancementProgress {
  id: string;
  progress: number;
  status: VideoJobStatus;
  estimated_completion_time: string | null;
}

export const useVideoEnhancements = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedEnhancement, setSelectedEnhancement] = useState<Enhancement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");
  const [speedFactor, setSpeedFactor] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState<Record<string, EnhancementProgress>>({});

  const { data: videos, isLoading } = useQuery({
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

  const handleSubmitEnhancement = async () => {
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

      setSelectedEnhancement(null);
    } catch (error: any) {
      toast({
        title: "Error submitting enhancement",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedVideo,
    setSelectedVideo,
    selectedEnhancement,
    setSelectedEnhancement,
    selectedFilter,
    setSelectedFilter,
    speedFactor,
    setSpeedFactor,
    isSubmitting,
    enhancementProgress,
    setEnhancementProgress,
    videos,
    isLoading,
    handleSubmitEnhancement
  };
};
