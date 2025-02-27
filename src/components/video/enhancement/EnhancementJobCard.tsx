
import React from 'react';
import { motion } from 'framer-motion';
import type { EnhancementProgress } from '@/hooks/use-video-enhancements';
import { ProgressBar } from '../common/ProgressBar';
import { TimeRemaining } from '../common/TimeRemaining';
import { CurrentStageInfo } from './CurrentStageInfo';
import { EnhancementStageIndicator } from './EnhancementStageIndicator';

interface EnhancementJobCardProps {
  job: EnhancementProgress;
}

export const EnhancementJobCard: React.FC<EnhancementJobCardProps> = ({ job }) => {
  // Calculate current frame based on progress
  const currentFrame = Math.round((job.progress / 100) * 240);
  
  // Define processing stages
  const stages = [
    {
      id: 'frame-gen',
      label: 'Frame Generation',
      isActive: false,
      isCompleted: true
    },
    {
      id: 'enhance',
      label: 'Enhancing Frames',
      isActive: true,
      isCompleted: false
    },
    {
      id: 'assembly',
      label: 'Final Assembly',
      isActive: false,
      isCompleted: false
    }
  ];
  
  return (
    <div className="glass-panel p-fib-4 rounded-lg">
      <div className="flex flex-col space-y-fib-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-aurora-white font-medium">Overall Progress:</span>
            <span className="text-aurora-blue font-semibold">{job.progress}%</span>
          </div>
          
          <div className="text-gray-400 text-sm">
            {job.estimated_completion_time && (
              <TimeRemaining 
                timeRemaining={job.estimated_completion_time} 
                prefix="~"
                className="text-gray-400 text-sm"
              />
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <ProgressBar progress={job.progress} />
        
        {/* Current stage info */}
        <CurrentStageInfo 
          stageName="Enhancing Frames" 
          currentFrame={currentFrame}
          totalFrames={240}
        />
        
        {/* Processing stages visualization */}
        <EnhancementStageIndicator stages={stages} />
      </div>
    </div>
  );
};
