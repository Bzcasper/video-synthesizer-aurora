
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import GenerateForm from "@/components/generate/GenerateForm";
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
  
  // Prevent multiple submissions
  const isSubmitting = useRef(false);

  // Clean up any animations on unmount
  useEffect(() => {
    return () => {
      // Any cleanup needed
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting.current || isGenerating) return;
    isSubmitting.current = true;
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

      // Reset form after successful submission
      setPrompt('');

    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start video generation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      isSubmitting.current = false;
    }
  };

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
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
              <div className="p-6">
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
              </div>
            </Card>
            
            {generatedVideos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow mb-4">
                  Recently Generated Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedVideos.map(video => (
                    <Card key={video.id} className="glass-panel p-4">
                      <div className="font-medium mb-2">{video.prompt}</div>
                      <div className="text-sm text-gray-400">
                        Status: {video.status === 'pending' ? 'Processing...' : video.status}
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Generate;
