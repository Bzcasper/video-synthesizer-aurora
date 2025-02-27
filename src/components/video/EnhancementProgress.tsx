
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { EnhancementProgress as EnhancementProgressType } from '@/hooks/use-video-enhancements';
import { motion } from 'framer-motion';

interface EnhancementProgressProps {
  progress: EnhancementProgressType;
}

export const EnhancementProgressBar = ({ progress }: EnhancementProgressProps) => {
  const isActive = progress.status === 'processing' || progress.status === 'pending';
  
  return (
    <Card className="glass-panel p-4 space-y-2">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              progress.status === 'processing' ? 'bg-aurora-blue animate-pulse' : 
              progress.status === 'completed' ? 'bg-aurora-green' : 
              progress.status === 'failed' ? 'bg-red-500' : 
              'bg-aurora-purple'
            }`} />
            <p className="text-sm font-medium text-aurora-white">
              {progress.status === 'completed' ? 'Enhancement Complete' : 
               progress.status === 'failed' ? 'Enhancement Failed' :
               progress.status === 'processing' ? 'Processing' : 'Queued'}
            </p>
          </div>
          
          {progress.estimated_completion_time && isActive && (
            <p className="text-xs text-gray-400">
              Estimated completion: {progress.estimated_completion_time}
            </p>
          )}
        </div>
        <span className="text-sm font-medium text-aurora-blue">{progress.progress}%</span>
      </div>
      
      <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
        <motion.div
          className={`absolute top-0 left-0 h-full ${
            progress.status === 'failed' 
              ? 'bg-gradient-to-r from-red-600 to-red-400' 
              : 'bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress.progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </Card>
  );
};
