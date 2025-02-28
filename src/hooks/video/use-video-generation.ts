
import { useState, useRef } from 'react';
import { toast } from "@/hooks/use-toast";
import { type Database } from "@/integrations/supabase/types";

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

interface VideoGenerationParams {
  prompt: string;
  duration: number;
  style: string;
  scenes: Scene[];
  resolution?: [number, number];
  fps?: number;
}

export const useVideoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentStage, setCurrentStage] = useState('Initializing...');
  
  const isSubmitting = useRef(false);
  const progressInterval = useRef<number | null>(null);

  // Cleanup function for intervals
  const cleanupIntervals = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Simulate progress updates
  const simulateProgress = () => {
    setGenerationProgress(0);
    setTimeRemaining(60); // Start with 60 seconds estimate
    
    const stages = [
      'Analyzing prompt...',
      'Generating frames...',
      'Applying style effects...',
      'Rendering video...',
      'Finalizing output...'
    ];
    
    let stageIndex = 0;
    setCurrentStage(stages[stageIndex]);
    
    // Update progress every second
    progressInterval.current = window.setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + (Math.random() * 2);
        
        // Move to next stage at certain thresholds
        if (newProgress > 20 && stageIndex === 0) {
          stageIndex = 1;
          setCurrentStage(stages[stageIndex]);
        } else if (newProgress > 40 && stageIndex === 1) {
          stageIndex = 2;
          setCurrentStage(stages[stageIndex]);
        } else if (newProgress > 65 && stageIndex === 2) {
          stageIndex = 3;
          setCurrentStage(stages[stageIndex]);
        } else if (newProgress > 85 && stageIndex === 3) {
          stageIndex = 4;
          setCurrentStage(stages[stageIndex]);
        }
        
        // Ensure we don't exceed 99% until actual completion
        return Math.min(newProgress, 99);
      });
      
      // Update remaining time estimation
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
  };

  const generateVideo = async (params: VideoGenerationParams) => {
    // Prevent multiple submissions
    if (isSubmitting.current || isGenerating) return;
    isSubmitting.current = true;
    setIsGenerating(true);
    
    try {
      // Start progress simulation
      simulateProgress();
      
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          duration: params.duration,
          style: params.style,
          resolution: params.resolution || [1920, 1080],
          fps: params.fps || 30,
          scenes: params.scenes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate video: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Complete progress
      setGenerationProgress(100);
      setTimeRemaining(0);
      setCurrentStage('Complete!');
      
      // Notify user
      toast({
        title: "Video Generation Started",
        description: "Your video is being generated. You'll be notified when it's ready.",
      });

      return data;
    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start video generation. Please try again.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      // Clean up and reset state after a delay
      setTimeout(() => {
        setIsGenerating(false);
        cleanupIntervals();
        isSubmitting.current = false;
      }, 1000);
    }
  };

  return {
    generateVideo,
    isGenerating,
    generationProgress,
    timeRemaining,
    currentStage,
  };
};
