
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { ErrorMessage } from "@/components/ui/error-message";
import GenerateForm from '@/components/generate/GenerateForm';
import GenerateHeader from '@/components/generate/GenerateHeader';
import { useVideoGeneration } from '@/hooks/use-video-generation';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

const Generate = () => {
  const navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    duration,
    setDuration,
    style,
    setStyle,
    isGenerating,
    handleGenerate
  } = useVideoGeneration();

  const { data: usageData, error: usageError } = useQuery({
    queryKey: ['monthlyUsage'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentMonth = new Date().toISOString().slice(0, 7) + '-01';

      const { data: existingUsage, error: selectError } = await supabase
        .from('monthly_usage')
        .select('video_count')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .single();

      if (!selectError && existingUsage) {
        return existingUsage;
      }

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

  const handleSubmit = async (e: React.FormEvent) => {
    if (usageData?.video_count >= 5) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your monthly limit. Please upgrade to continue generating videos.",
        variant: "destructive",
      });
      navigate('/dashboard/settings?upgrade=true');
      return;
    }
    await handleGenerate(e);
  };

  if (usageError) {
    return <ErrorMessage message="Failed to load usage data. Please try again later." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <GenerateHeader />
      <GenerateForm
        prompt={prompt}
        setPrompt={setPrompt}
        duration={duration}
        setDuration={setDuration}
        style={style}
        setStyle={setStyle}
        isGenerating={isGenerating}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Generate;
