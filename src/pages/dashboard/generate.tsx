
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import GenerateForm from "@/components/generate/GenerateForm";
import { VideoEnhancementSelector } from "@/components/video/VideoEnhancementSelector";
import type { Video } from "@/hooks/use-video-enhancements";

const Generate = () => {
  // State for video generation
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState('cinematic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<Video[]>([]);

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      
      toast({
        title: "Video Generation Started",
        description: "Your video is being generated. You'll be notified when it's ready.",
      });

      // Add the new video to the list
      setGeneratedVideos(prev => [...prev, {
        id: data.id,
        prompt,
        created_at: new Date().toISOString(),
        output_url: null,
        status: 'pending'
      }]);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-orbitron font-bold text-gradient bg-gradient-glow mb-8">
          Create & Enhance
        </h1>

        <Card className="glass-panel">
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger
                value="generate"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-aurora-purple data-[state=active]:to-aurora-blue"
              >
                Generate Video
              </TabsTrigger>
              <TabsTrigger
                value="enhance"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-aurora-purple data-[state=active]:to-aurora-blue"
              >
                Enhance Video
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="generate">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              </TabsContent>

              <TabsContent value="enhance">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <VideoEnhancementSelector />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default Generate;
