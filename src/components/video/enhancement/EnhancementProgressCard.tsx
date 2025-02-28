
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/video/common/ProgressBar";
import { TimeRemaining } from "@/components/video/common/TimeRemaining";
import { type VideoJobStatus } from '@/hooks/video/types';

interface EnhancementProgressCardProps {
  progress: number;
  status: VideoJobStatus;
  remainingTime: number | string;
  stage: string;
  totalStages: number;
}

export const EnhancementProgressCard: React.FC<EnhancementProgressCardProps> = ({
  progress,
  status,
  remainingTime,
  stage,
  totalStages
}) => {
  return (
    <Card className="w-full glass-panel">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Enhancement Progress</h3>
          <span className="text-sm text-gray-400">Stage {stage} of {totalStages}</span>
        </div>
        
        <ProgressBar progress={progress} status={status} />
        
        {status === 'processing' && (
          <TimeRemaining timeRemaining={parseInt(String(remainingTime))} />
        )}
        
        <div className="mt-2 text-xs text-gray-400">
          {status === 'completed' && "Enhancement completed successfully"}
          {status === 'failed' && "Enhancement failed. Please try again."}
          {status === 'pending' && "Waiting to start enhancement..."}
          {status === 'processing' && `Processing stage ${stage}: ${getStageDescription(stage)}`}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get stage description
function getStageDescription(stage: string): string {
  const stages: Record<string, string> = {
    '1': 'Analyzing video content',
    '2': 'Applying enhancements',
    '3': 'Finalizing and rendering',
  };
  
  return stages[stage] || 'Processing...';
}
