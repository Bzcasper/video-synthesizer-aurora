
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { EnhancementProgress as EnhancementProgressType } from '@/hooks/use-video-enhancements';

interface EnhancementProgressProps {
  progress: EnhancementProgressType;
}

export const EnhancementProgressBar = ({ progress }: EnhancementProgressProps) => {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            Enhancement {progress.status === 'completed' ? 'Complete' : 'In Progress'}
          </p>
          {progress.estimated_completion_time && progress.status === 'processing' && (
            <p className="text-xs text-muted-foreground">
              Estimated completion: {new Date(progress.estimated_completion_time).toLocaleTimeString()}
            </p>
          )}
        </div>
        <span className="text-sm font-medium">{progress.progress}%</span>
      </div>
      <Progress value={progress.progress} className="h-2" />
    </Card>
  );
};
