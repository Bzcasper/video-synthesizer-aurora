
import React from 'react';

interface CurrentStageInfoProps {
  stageName: string;
  currentFrame?: number;
  totalFrames?: number;
}

export const CurrentStageInfo: React.FC<CurrentStageInfoProps> = ({ 
  stageName,
  currentFrame,
  totalFrames 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between p-3 bg-black/30 rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 rounded-full bg-aurora-blue animate-pulse" />
        <span className="text-aurora-white">Current Stage: {stageName}</span>
      </div>
      
      {currentFrame !== undefined && totalFrames !== undefined && (
        <div className="text-gray-400 text-sm mt-2 sm:mt-0">
          Processing frame {currentFrame}/{totalFrames}
        </div>
      )}
    </div>
  );
};
