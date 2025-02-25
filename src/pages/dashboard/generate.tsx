
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Video, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const videoStyles = [
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Professional movie-like quality with dramatic shots',
  },
  {
    id: 'anime',
    label: 'Anime',
    description: 'Japanese animation style with vibrant colors',
  },
  {
    id: 'realistic',
    label: 'Realistic',
    description: 'True-to-life footage with natural lighting',
  },
  {
    id: 'artistic',
    label: 'Artistic',
    description: 'Creative and experimental visual effects',
  },
];

const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('cinematic');

  const handleGenerate = async () => {
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

      <Card className="p-6 glass-panel hover-glow">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-aurora-blue" />
              Video Description
            </label>
            <Textarea
              placeholder="Describe your video in detail. For example: A serene mountain landscape at sunset, with clouds moving in timelapse..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 bg-white/5 border-white/10 text-white focus:ring-aurora-blue 
                       hover:border-aurora-blue/50 transition-colors"
            />
            <p className="text-sm text-gray-400">
              Be specific about what you want to see in your video. Include details about mood, lighting, and movement.
            </p>
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
              <div className="flex justify-between text-sm text-gray-400">
                <span>5s</span>
                <span>{duration}s (selected)</span>
                <span>60s</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Video Style</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {videoStyles.map((styleOption) => (
                <motion.button
                  key={styleOption.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStyle(styleOption.id)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    style === styleOption.id 
                      ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
                      : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
                  }`}
                >
                  <div className="font-medium">{styleOption.label}</div>
                  <div className="text-sm text-gray-400 mt-1">{styleOption.description}</div>
                </motion.button>
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
