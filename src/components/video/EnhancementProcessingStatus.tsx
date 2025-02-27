
import React from 'react';
import { useVideoEnhancements } from '@/hooks/use-video-enhancements';
import { motion } from 'framer-motion';
import CustomIcon from '@/components/ui/custom-icon';

export const EnhancementProcessingStatus = () => {
  const { enhancementProgress } = useVideoEnhancements();
  
  const activeJobs = Object.values(enhancementProgress).filter(
    (job) => job.status === 'processing' || job.status === 'pending'
  );
  
  if (activeJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-fib-5 px-fib-4 bg-black/20 rounded-lg border border-white/5">
        <CustomIcon name="processing" className="h-fib-5 w-fib-5 text-gray-600 mb-3" />
        <p className="text-gray-400">No active enhancement jobs</p>
        <p className="text-gray-500 text-sm mt-1">
          Select a video and apply enhancements to see processing status here
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-fib-4">
      {activeJobs.map((job) => (
        <div key={job.id} className="glass-panel p-fib-4 rounded-lg">
          <div className="flex flex-col space-y-fib-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-aurora-white font-medium">Overall Progress:</span>
                <span className="text-aurora-blue font-semibold">{job.progress}%</span>
              </div>
              
              <div className="text-gray-400 text-sm">
                {job.estimated_completion_time && (
                  <span>~{job.estimated_completion_time} left</span>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green"
                initial={{ width: 0 }}
                animate={{ width: `${job.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Current stage info */}
            <div className="flex flex-col sm:flex-row justify-between p-3 bg-black/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-aurora-blue animate-pulse" />
                <span className="text-aurora-white">Current Stage: Enhancing Frames</span>
              </div>
              
              <div className="text-gray-400 text-sm mt-2 sm:mt-0">
                Processing frame {Math.round((job.progress / 100) * 240)}/240
              </div>
            </div>
            
            {/* Processing stages visualization */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-aurora-green" />
                <span className="text-sm text-gray-400">Frame Generation</span>
              </div>
              
              <div className="h-0.5 flex-1 bg-gray-800 mx-2" />
              
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-aurora-purple animate-pulse" />
                <span className="text-sm text-aurora-white">Enhancing Frames</span>
              </div>
              
              <div className="h-0.5 flex-1 bg-gray-800 mx-2" />
              
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-gray-800" />
                <span className="text-sm text-gray-600">Final Assembly</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
