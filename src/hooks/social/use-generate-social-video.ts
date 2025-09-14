import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VideoGenerationOptions, Platform } from "@/types/social";

export const useGenerateSocialVideo = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("Initializing...");

  const progressInterval = useRef<number | null>(null);
  const isSubmitting = useRef(false);

  // Clean up function for progress simulation
  const cleanupProgressInterval = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Simulate progress for better UX
  const simulateProgress = () => {
    setGenerationProgress(0);
    setGenerationStage("Analyzing content...");

    const stages = [
      "Analyzing content...",
      "Generating script...",
      "Creating voiceovers...",
      "Generating visuals...",
      "Adding music and effects...",
      "Formatting for platforms...",
      "Finalizing videos...",
    ];

    let stageIndex = 0;

    progressInterval.current = window.setInterval(() => {
      setGenerationProgress((prev) => {
        const increment = Math.random() * 2 + 0.5; // Random increment between 0.5 and 2.5
        const newProgress = prev + increment;

        // Move to next stage at certain thresholds
        if (newProgress > 15 && stageIndex === 0) {
          stageIndex = 1;
          setGenerationStage(stages[stageIndex]);
        } else if (newProgress > 30 && stageIndex === 1) {
          stageIndex = 2;
          setGenerationStage(stages[stageIndex]);
        } else if (newProgress > 45 && stageIndex === 2) {
          stageIndex = 3;
          setGenerationStage(stages[stageIndex]);
        } else if (newProgress > 60 && stageIndex === 3) {
          stageIndex = 4;
          setGenerationStage(stages[stageIndex]);
        } else if (newProgress > 75 && stageIndex === 4) {
          stageIndex = 5;
          setGenerationStage(stages[stageIndex]);
        } else if (newProgress > 90 && stageIndex === 5) {
          stageIndex = 6;
          setGenerationStage(stages[stageIndex]);
        }

        // Cap progress at 99% until complete
        return Math.min(newProgress, 99);
      });
    }, 800);
  };

  const generateVideo = async (
    contentSections: string[],
    platforms: Platform[],
    options: VideoGenerationOptions,
  ) => {
    // Prevent multiple submissions
    if (isSubmitting.current || isGenerating) return;
    isSubmitting.current = true;
    setIsGenerating(true);

    try {
      // Start progress simulation for UX
      simulateProgress();

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke(
        "generate-social-video",
        {
          body: {
            content: contentSections,
            platforms,
            options,
          },
        },
      );

      if (error) {
        throw new Error(`Failed to generate videos: ${error.message}`);
      }

      // Set progress to 100% on success
      setGenerationProgress(100);
      setGenerationStage("Videos generated successfully!");

      toast({
        title: "Videos Generated",
        description: `${platforms.length} videos have been created and are ready to use!`,
      });

      return data;
    } catch (error) {
      console.error("Error generating social videos:", error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate social media videos. Please try again.",
        variant: "destructive",
      });

      return null;
    } finally {
      // Clean up and reset state after a delay
      setTimeout(() => {
        setIsGenerating(false);
        cleanupProgressInterval();
        isSubmitting.current = false;
      }, 1000);
    }
  };

  return {
    generateVideo,
    isGenerating,
    generationProgress,
    generationStage,
  };
};
