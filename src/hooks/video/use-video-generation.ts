
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { VideoJobStatus } from '../video/types';

interface VideoGenerationOptions {
  prompt: string;
  duration: number;
  style: string;
  resolution?: string;
  aspectRatio?: string;
}

interface VideoGenerationResult {
  videoId: string;
  outputUrl: string | null;
  status: VideoJobStatus;
}

export function useVideoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [result, setResult] = useState<VideoGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async (options: VideoGenerationOptions) => {
    if (!options.prompt) {
      toast({
        description: "Please provide a description for your video.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsGenerating(true);
      setProgress(0);
      setTimeRemaining(options.duration * 6); // Rough estimate
      setCurrentStage('Initializing');
      setError(null);

      // Mock progress updates for demonstration
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (1 + Math.random() * 2);
          
          // Update current stage based on progress
          if (newProgress > 20 && newProgress <= 40) {
            setCurrentStage('Generating scenes');
          } else if (newProgress > 40 && newProgress <= 60) {
            setCurrentStage('Adding effects');
          } else if (newProgress > 60 && newProgress <= 80) {
            setCurrentStage('Rendering frames');
          } else if (newProgress > 80) {
            setCurrentStage('Finalizing video');
          }
          
          // Update time remaining
          setTimeRemaining((prev) => Math.max(0, prev - 1));
          
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Simulate completion after a short delay
            setTimeout(() => {
              setResult({
                videoId: `vid-${Date.now().toString(36)}`,
                outputUrl: 'https://example.com/video.mp4',
                status: 'completed' as VideoJobStatus,
              });
              
              toast({
                description: "Video generated successfully!",
                variant: "default",
              });
              
              setIsGenerating(false);
            }, 1000);
            
            return 100;
          }
          
          return newProgress;
        });
      }, 500);
      
      // Simulate potential error (10% chance)
      if (Math.random() < 0.1) {
        setTimeout(() => {
          clearInterval(interval);
          setError('Generation failed. Please try again with a different prompt.');
          setIsGenerating(false);
        }, 5000 + Math.random() * 10000);
      }
      
      return true;
    } catch (err) {
      console.error('Error generating video:', err);
      setError('An unexpected error occurred.');
      setIsGenerating(false);
      return null;
    }
  };

  const cancelGeneration = () => {
    setIsGenerating(false);
    setProgress(0);
    setCurrentStage('');
    toast({
      description: "Video generation cancelled.",
      variant: "default",
    });
  };

  return {
    isGenerating,
    progress,
    currentStage,
    timeRemaining,
    result,
    error,
    generateVideo,
    cancelGeneration,
  };
}
