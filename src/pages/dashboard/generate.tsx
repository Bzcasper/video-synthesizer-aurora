
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import GenerateForm from "@/components/generate/GenerateForm";
import { VideoEnhancementSelector } from "@/components/video/VideoEnhancementSelector";
import { type Database } from "@/integrations/supabase/types";
import type { Video } from "@/hooks/use-video-enhancements";
import { ChevronLeft } from "lucide-react";

type SceneType = Database["public"]["Enums"]["scene_type"];
type CameraMotion = Database["public"]["Enums"]["camera_motion_type"];

interface Scene {
  prompt: string;
  sceneType: SceneType;
  cameraMotion: CameraMotion;
  duration: number;
  sequenceOrder: number;
  transitionType?: string;
}

const Generate = () => {
  // State for video generation
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState('cinematic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<Video[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [animationFrameId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          duration,
          style,
          resolution: [1920, 1080],
          fps: 30,
          scenes: scenes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate video: ${response.statusText}`);
      }

      const data = await response.json();
      
      toast({
        title: "Video Generation Started",
        description: "Your video is being generated. You'll be notified when it's ready.",
      });

      setGeneratedVideos(prev => [...prev, {
        id: data.id,
        prompt,
        created_at: new Date().toISOString(),
        output_url: null,
        status: 'pending'
      }]);

    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start video generation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Optimized animation handler using useCallback
  const handleAnimation = useCallback(() => {
    // Implement any necessary animations here
    // This is now optimized and won't cause performance warnings
  }, []);

  return (
    <div className="min-h-screen bg-aurora-black flex">
      {/* Collapsible Sidebar with optimized animation */}
      <motion.aside
        initial={{ width: '64px' }}
        animate={{ width: isSidebarCollapsed ? '64px' : '240px' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col overflow-hidden"
      >
        {/* Logo and Toggle Button */}
        <div className="p-4 flex items-center justify-center">
          <motion.button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
              alt="Aurora"
              className="h-8 w-8"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content with optimized animations */}
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h1 className="text-4xl font-orbitron font-bold text-gradient bg-gradient-glow mb-8">
              Generate Your Imagination
            </h1>

            <Card className="glass-panel">
              <GenerateForm
                prompt={prompt}
                setPrompt={setPrompt}
                duration={duration}
                setDuration={setDuration}
                style={style}
                setStyle={setStyle}
                isGenerating={isGenerating}
                onSubmit={handleSubmit}
                scenes={scenes}
                setScenes={setScenes}
              />
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Generate;
