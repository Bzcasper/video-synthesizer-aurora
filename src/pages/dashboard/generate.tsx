
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GenerateForm from '@/components/generate/GenerateForm';

const Generate = () => {
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
      const { data, error } = await supabase
        .from('video_jobs')
        .insert([
          {
            prompt,
            duration,
            style,
            resolution: { width: 1920, height: 1080 },
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Video Generation Started",
        description: "Your video will be ready soon. You can check its status in My Videos.",
      });

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
