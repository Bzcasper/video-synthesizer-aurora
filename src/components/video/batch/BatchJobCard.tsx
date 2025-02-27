
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '../common/StatusIndicator';
import { TimeRemaining } from '../common/TimeRemaining';
import { ProgressBar } from '../common/ProgressBar';
import CustomIcon from '@/components/ui/custom-icon';

export interface BatchJob {
  id: string;
  title: string;
  progress: number;
  status: 'processing' | 'queued' | 'paused';
  timeRemaining: string;
}

interface BatchJobCardProps {
  job: BatchJob;
  onPause: (id: string) => void;
  onCancel: (id: string) => void;
  index: number;
}

export const BatchJobCard: React.FC<BatchJobCardProps> = ({ 
  job, 
  onPause, 
  onCancel, 
  index 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-panel rounded-lg gap-4"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <StatusIndicator status={job.status} showLabel={false} />
          <h3 className="text-aurora-white font-medium">{job.title}</h3>
        </div>
        
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CustomIcon name="processing" className="h-3 w-3" />
            <span>
              {job.status === 'processing' ? 'Processing' : 
               job.status === 'paused' ? 'Paused' : 'Queued'}
            </span>
          </div>
          
          {job.timeRemaining && (
            <TimeRemaining 
              timeRemaining={job.timeRemaining} 
              prefix="~"
              className="text-xs text-gray-400"
            />
          )}
        </div>
        
        <div className="mt-2">
          <ProgressBar 
            progress={job.progress} 
            status={job.status === 'paused' ? 'failed' : 'processing'}
            className="h-1.5"
          />
        </div>
      </div>
      
      <div className="flex gap-2 self-end sm:self-auto">
        <Button 
          variant="outline" 
          className="border-aurora-blue/30 hover:border-aurora-blue/60 text-aurora-blue"
          onClick={() => onPause(job.id)}
        >
          {job.status === 'paused' ? 'Resume' : 'Pause'}
        </Button>
        <Button 
          variant="outline" 
          className="border-red-500/30 hover:border-red-500/60 text-red-500"
          onClick={() => onCancel(job.id)}
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  );
};
