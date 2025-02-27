
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface ProcessingStage {
  id: string;
  name: string;
  description?: string;
  progress: number;
  status: 'waiting' | 'processing' | 'completed' | 'failed';
}

interface VideoProcessingStatusProps {
  jobId: string;
  videoTitle: string;
  overallProgress: number;
  stages: ProcessingStage[];
  estimatedTimeRemaining?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  onComplete?: () => void;
  className?: string;
}

export function VideoProcessingStatus({
  jobId,
  videoTitle,
  overallProgress,
  stages,
  estimatedTimeRemaining,
  status,
  onComplete,
  className
}: VideoProcessingStatusProps) {
  // Format the estimated time remaining
  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };
  
  // Simulated progress for demo purposes
  // In a real app, this would be replaced with actual API polling
  const [simulatedProgress, setSimulatedProgress] = useState(overallProgress);
  const [remainingTime, setRemainingTime] = useState(estimatedTimeRemaining || 180);
  
  useEffect(() => {
    // Only run the simulation if we're in the processing state
    if (status === 'processing' && simulatedProgress < 100) {
      const interval = setInterval(() => {
        setSimulatedProgress(prev => {
          // Random increment between 1-3%
          const increment = Math.random() * 2 + 1;
          const newProgress = Math.min(99, prev + increment);
          
          // If we've reached 99%, stop the interval
          if (newProgress >= 99) {
            clearInterval(interval);
            
            // After a short delay, mark as complete
            setTimeout(() => {
              setSimulatedProgress(100);
              if (onComplete) onComplete();
            }, 2000);
          }
          
          return newProgress;
        });
        
        // Update remaining time
        setRemainingTime(prev => Math.max(0, prev - 2));
      }, 2000); // Update every 2 seconds
      
      return () => clearInterval(interval);
    }
  }, [status, simulatedProgress, onComplete]);
  
  // Get the current active stage
  const activeStageIndex = stages.findIndex(stage => stage.status === 'processing');
  
  // Status badge style based on status
  const getStatusBadgeStyle = (status: 'pending' | 'processing' | 'completed' | 'failed') => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-aurora-black to-black/80 border border-white/10 ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-aurora-white">{videoTitle}</h3>
            <p className="text-sm text-gray-400">Job ID: {jobId}</p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium border mt-2 sm:mt-0 
            ${getStatusBadgeStyle(status)}`}>
            {status === 'pending' && 'Pending'}
            {status === 'processing' && 'Processing'}
            {status === 'completed' && 'Completed'}
            {status === 'failed' && 'Failed'}
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm font-medium text-aurora-blue">{Math.round(simulatedProgress)}%</span>
          </div>
          
          <Progress 
            value={simulatedProgress}
            className="h-2"
            indicatorClassName={status === 'failed' 
              ? 'bg-red-500' 
              : 'bg-gradient-to-r from-aurora-blue to-aurora-purple'}
          />
          
          {remainingTime > 0 && status === 'processing' && (
            <p className="text-xs text-gray-400 mt-2">
              Estimated time remaining: ~{formatTimeRemaining(remainingTime)}
            </p>
          )}
        </div>
        
        <Separator className="bg-white/10 mb-6" />
        
        {/* Processing Stages */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400">Processing Stages</h4>
          
          <div className="space-y-6">
            {stages.map((stage, index) => (
              <div key={stage.id} className="relative">
                {/* Stage Connector Line (for all but the last stage) */}
                {index < stages.length - 1 && (
                  <div className={`absolute left-3 top-8 w-0.5 h-12 -ml-[1px] 
                    ${stage.status === 'completed' 
                      ? 'bg-aurora-green' 
                      : stage.status === 'processing' 
                        ? 'bg-gradient-to-b from-aurora-blue to-gray-800' 
                        : 'bg-gray-800'}`}
                  />
                )}
                
                <div className="flex items-start">
                  {/* Status Indicator */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 
                    ${stage.status === 'completed' 
                      ? 'bg-aurora-green text-black' 
                      : stage.status === 'processing' 
                        ? 'bg-aurora-blue animate-pulse' 
                        : stage.status === 'failed' 
                          ? 'bg-red-500' 
                          : 'bg-gray-800'}`}
                  >
                    {stage.status === 'completed' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                    {stage.status === 'failed' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    )}
                  </div>
                  
                  {/* Stage Info */}
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h5 className={`font-medium ${
                        stage.status === 'processing' 
                          ? 'text-aurora-white' 
                          : stage.status === 'completed' 
                            ? 'text-aurora-green' 
                            : stage.status === 'failed' 
                              ? 'text-red-400' 
                              : 'text-gray-500'}`}
                      >
                        {stage.name}
                      </h5>
                      <span className={`text-sm ${
                        stage.status === 'processing' 
                          ? 'text-aurora-blue' 
                          : stage.status === 'completed' 
                            ? 'text-aurora-green' 
                            : stage.status === 'failed' 
                              ? 'text-red-400' 
                              : 'text-gray-500'}`}
                      >
                        {stage.status === 'processing' && `${stage.progress}%`}
                        {stage.status === 'completed' && 'Complete'}
                        {stage.status === 'failed' && 'Failed'}
                        {stage.status === 'waiting' && 'Waiting'}
                      </span>
                    </div>
                    
                    {stage.description && (
                      <p className="text-xs text-gray-400 mt-1">{stage.description}</p>
                    )}
                    
                    {/* Progress bar for active stage */}
                    {stage.status === 'processing' && (
                      <Progress 
                        value={stage.progress}
                        className="h-1 mt-2"
                        indicatorClassName="bg-aurora-blue"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
