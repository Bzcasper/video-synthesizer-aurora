
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type VideoJob = {
  prompt: string;
  duration: number;
  style: string;
  resolution: { width: number; height: number };
  status: Database['public']['Enums']['video_job_status'];
  user_id: string;
  metadata: {
    source: string;
    browser: string;
    timestamp: string;
  };
};

export const useVideoGeneration = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('cinematic');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const videoJob: VideoJob = {
        prompt,
        duration,
        style,
        resolution: { width: 1920, height: 1080 },
        status: 'pending',
        user_id: user.id,
        metadata: {
          source: 'web_app',
          browser: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      };

      const { data, error } = await supabase
        .from('video_jobs')
        .insert([videoJob])
        .select()
        .single();

      if (error) throw error;

      const { error: functionError } = await supabase.functions.invoke('generate-video', {
        body: { job_id: data.id, prompt, duration, style }
      });

      if (functionError) throw functionError;

      toast({
        title: "Video Generation Started",
        description: "Your video will be ready soon. You can check its status in My Videos.",
      });

      await supabase
        .from('tasks')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('task_type', 'video_generation')
        .eq('status', 'pending');

      navigate('/dashboard/videos');
    } catch (error) {
      console.error('Error starting video generation:', error);
      toast({
        title: "Error",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    prompt,
    setPrompt,
    duration,
    setDuration,
    style,
    setStyle,
    isGenerating,
    handleGenerate
  };
};
