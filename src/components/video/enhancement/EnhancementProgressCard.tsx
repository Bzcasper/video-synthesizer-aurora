import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/video/common/ProgressBar";
import { TimeRemaining } from "@/components/video/common/TimeRemaining";
import {
  type EnhancementProgress,
  type VideoJobStatus,
} from "@/hooks/video/types";

interface EnhancementProgressCardProps {
  progress: EnhancementProgress;
}

export const EnhancementProgressCard: React.FC<
  EnhancementProgressCardProps
> = ({ progress }) => {
  // Calculate stage based on progress percentage
  const getStage = (progressValue: number): string => {
    if (progressValue < 30) return "1";
    if (progressValue < 70) return "2";
    return "3";
  };

  const stage = getStage(progress.progress);
  const totalStages = 3;

  // Calculate remaining time based on progress and status
  const calculateRemainingTime = (progress: EnhancementProgress): number => {
    if (progress.status !== "processing") return 0;

    if (progress.estimated_completion_time) {
      const estimatedTime = new Date(
        progress.estimated_completion_time,
      ).getTime();
      const currentTime = new Date().getTime();
      const remainingMs = Math.max(0, estimatedTime - currentTime);
      return Math.floor(remainingMs / 1000); // Convert ms to seconds
    }

    // Fallback calculation if no estimated time is provided
    const remainingPercentage = 100 - progress.progress;
    return Math.floor(remainingPercentage * 3); // Roughly 3 seconds per 1% remaining
  };

  const remainingTime = calculateRemainingTime(progress);

  return (
    <Card className="w-full glass-panel">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Enhancement Progress</h3>
          <span className="text-sm text-gray-400">
            Stage {stage} of {totalStages}
          </span>
        </div>

        <ProgressBar progress={progress.progress} status={progress.status} />

        {progress.status === "processing" && (
          <TimeRemaining timeRemaining={remainingTime} />
        )}

        <div className="mt-2 text-xs text-gray-400">
          {progress.status === "completed" &&
            "Enhancement completed successfully"}
          {progress.status === "failed" &&
            "Enhancement failed. Please try again."}
          {progress.status === "pending" && "Waiting to start enhancement..."}
          {progress.status === "processing" &&
            `Processing stage ${stage}: ${getStageDescription(stage)}`}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get stage description
function getStageDescription(stage: string): string {
  const stages: Record<string, string> = {
    "1": "Analyzing video content",
    "2": "Applying enhancements",
    "3": "Finalizing and rendering",
  };

  return stages[stage] || "Processing...";
}
