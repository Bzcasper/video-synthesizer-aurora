
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/video/common/ProgressBar";
import { TimeRemaining } from "@/components/video/common/TimeRemaining";
import { type EnhancementProgress, type VideoJobStatus } from '@/hooks/video/types';

interface EnhancementProgressCardProps {
  progress: EnhancementProgress;
}

export const EnhancementProgressCard: React.FC<EnhancementProgressCardProps> = ({
  progress
}) => {
  // Calculate remaining time in seconds from estimated completion time
  const getRemainingTime = (): number => {
    if (!progress.estimated_completion_time) return 300; // Default 5 minutes
    
    const estimatedTime = new Date(progress.estimated_completion_time).getTime();
    const currentTime = Date.now();
    const remainingMs = Math.max(0, estimatedTime - currentTime);
    
    return Math.floor(remainingMs / 1000);
  };

  // For the stage display (this is a placeholder logic - adjust as needed)
  const getStage = (): number => {
    if (progress.progress < 33) return 1;
    if (progress.progress < 66) return 2;
    return 3;
  };

  const stage = getStage();
  const totalStages = 3;
  const remainingTime = getRemainingTime();

  return (
    <Card className="w-full glass-panel">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Enhancement Progress</h3>
          <span className="text-sm text-gray-400">Stage {stage} of {totalStages}</span>
        </div>
        
        <ProgressBar progress={progress.progress} status={progress.status} />
        
        {progress.status === 'processing' && (
          <TimeRemaining timeRemaining={remainingTime} />
        )}
        
        <div className="mt-2 text-xs text-gray-400">
          {progress.status === 'completed' && "Enhancement completed successfully"}
          {progress.status === 'failed' && "Enhancement failed. Please try again."}
          {progress.status === 'pending' && "Waiting to start enhancement..."}
          {progress.status === 'processing' && `Processing stage ${stage}: ${getStageDescription(stage)}`}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get stage description
function getStageDescription(stage: number): string {
  const stages: Record<string, string> = {
    '1': 'Analyzing video content',
    '2': 'Applying enhancements',
    '3': 'Finalizing and rendering',
  };
  
  return stages[stage.toString()] || 'Processing...';
}
