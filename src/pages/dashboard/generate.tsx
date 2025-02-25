
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ErrorMessage } from "@/components/ui/error-message";
import GenerateForm from '@/components/generate/GenerateForm';
import { useQuery } from '@tanstack/react-query';

const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('cinematic');

  // Check user's monthly usage and subscription status
  const { data: usageData, error: usageError } = useQuery({
    queryKey: ['monthlyUsage'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentMonth = new Date().toISOString().slice(0, 7) + '-01';

      // First try to get existing usage
      const { data: existingUsage, error: selectError } = await supabase
        .from('monthly_usage')
        .select('video_count')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .single();

      if (!selectError && existingUsage) {
        return existingUsage;
      }

      // If no usage exists, create a new record
      const { data: newUsage, error: insertError } = await supabase
        .from('monthly_usage')
        .insert([
          {
            user_id: user.id,
            month: currentMonth,
            video_count: 0
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating usage record:', insertError);
        return { video_count: 0 };
      }

      return newUsage || { video_count: 0 };
    }
  });

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

    // Check monthly usage limit for free tier
    if (usageData?.video_count >= 5) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your monthly limit. Please upgrade to continue generating videos.",
        variant: "destructive",
      });
      navigate('/dashboard/settings?upgrade=true');
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('video_jobs')
        .insert([
          {
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
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Trigger the video generation edge function
      const { error: functionError } = await supabase.functions.invoke('generate-video', {
        body: { job_id: data.id, prompt, duration, style }
      });

      if (functionError) throw functionError;

      toast({
        title: "Video Generation Started",
        description: "Your video will be ready soon. You can check its status in My Videos.",
      });

      // Mark the corresponding task as completed
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

  if (usageError) {
    return <ErrorMessage message="Failed to load usage data. Please try again later." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-glow">
          Generate Video
        </h1>
      </div>

      <GenerateForm
        prompt={prompt}
        setPrompt={setPrompt}
        duration={duration}
        setDuration={setDuration}
        style={style}
        setStyle={setStyle}
        isGenerating={isGenerating}
        onSubmit={handleGenerate}
      />
    </div>
  );
};

export default Generate;
