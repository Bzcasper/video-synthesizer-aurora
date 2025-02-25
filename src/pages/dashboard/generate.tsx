
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Video, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration] = useState(15); // Default 15 seconds
  const [style, setStyle] = useState('cinematic');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Insert the video job into the database
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

      // Navigate to the videos page after successful generation start
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

      <Card className="p-6 glass-panel hover-glow">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Video Description</label>
            <Textarea
              placeholder="Describe the video you want to generate in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 bg-white/5 border-white/10 text-white focus:ring-aurora-blue 
                       hover:border-aurora-blue/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Duration (seconds)</label>
            <div className="pt-2">
              <Slider
                value={[duration]}
                onValueChange={(values) => setDuration(values[0])}
                min={5}
                max={60}
                step={5}
                className="py-2"
              />
              <div className="text-sm text-gray-400 mt-1">{duration} seconds</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Style</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['cinematic', 'anime', 'realistic', 'artistic'].map((styleOption) => (
                <Button
                  key={styleOption}
                  type="button"
                  variant={style === styleOption ? 'default' : 'outline'}
                  onClick={() => setStyle(styleOption)}
                  className={`capitalize ${
                    style === styleOption 
                      ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none' 
                      : 'border-white/10 hover:border-aurora-blue/50'
                  }`}
                >
                  {styleOption}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                     hover:from-aurora-blue hover:to-aurora-purple transition-all
                     duration-300 font-semibold text-white shadow-neon"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Generate Video
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Generate;
