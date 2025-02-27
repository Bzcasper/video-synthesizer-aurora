
import React from 'react';
import { Card } from "@/components/ui/card";
import type { EnhancementProgress as EnhancementProgressType } from '@/hooks/use-video-enhancements';
import { StatusIndicator } from '../common/StatusIndicator';
import { TimeRemaining } from '../common/TimeRemaining';
import { ProgressBar } from '../common/ProgressBar';

interface EnhancementProgressProps {
  progress: EnhancementProgressType;
}

export const EnhancementProgressCard: React.FC<EnhancementProgressProps> = ({ progress }) => {
  const isActive = progress.status === 'processing' || progress.status === 'pending';
  
  const statusLabelMap = {
    completed: 'Enhancement Complete',
    failed: 'Enhancement Failed',
    processing: 'Processing',
    pending: 'Queued',
    queued: 'Queued'
  };
  
  return (
    <Card className="glass-panel p-4 space-y-2">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <StatusIndicator 
            status={progress.status} 
            labelMap={statusLabelMap}
          />
          
          {progress.estimated_completion_time && isActive && (
            <TimeRemaining timeRemaining={progress.estimated_completion_time} />
          )}
        </div>
        <span className="text-sm font-medium text-aurora-blue">{progress.progress}%</span>
      </div>
      
      <ProgressBar 
        progress={progress.progress} 
        status={progress.status}
      />
    </Card>
  );
};
