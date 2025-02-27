
import React from 'react';
import { motion } from 'framer-motion';
import CustomIcon from '@/components/ui/custom-icon';
import { Button } from '@/components/ui/button';

export interface BatchJob {
  id: string;
  title: string;
  progress: number;
  status: 'processing' | 'queued' | 'paused';
  timeRemaining: string;
}

export const BatchQueueList = () => {
  const [activeJobs, setActiveJobs] = React.useState<BatchJob[]>([
    {
      id: 'job-1',
      title: 'Ocean waves at sunset',
      progress: 45,
      status: 'processing',
      timeRemaining: '12:30'
    },
    {
      id: 'job-2',
      title: 'Urban night timelapse',
      progress: 10,
      status: 'queued',
      timeRemaining: '25:45'
    },
    {
      id: 'job-3',
      title: 'Mountain forest aerial',
      progress: 0,
      status: 'queued',
      timeRemaining: '32:15'
    }
  ]);
  
  const handlePause = (jobId: string) => {
    setActiveJobs(
      activeJobs.map(job => 
        job.id === jobId 
          ? { ...job, status: job.status === 'paused' ? 'processing' : 'paused' } 
          : job
      )
    );
  };
  
  const handleCancel = (jobId: string) => {
    setActiveJobs(activeJobs.filter(job => job.id !== jobId));
  };
  
  if (activeJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-fib-6 px-fib-4 bg-black/20 rounded-lg border border-white/5">
        <CustomIcon name="batch" className="h-fib-5 w-fib-5 text-gray-600 mb-3" />
        <p className="text-gray-400">No active batch processing jobs</p>
        <p className="text-gray-500 text-sm mt-1">
          Generate or enhance videos to add them to the queue
        </p>
        <Button 
          className="mt-fib-4 bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
          onClick={() => window.location.href = '/dashboard/generate'}
        >
          <CustomIcon name="generate" className="mr-2 h-5 w-5" />
          Generate New Video
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-fib-3">
      {activeJobs.map((job, index) => (
        <motion.div 
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-panel rounded-lg gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                job.status === 'processing' ? 'bg-aurora-blue animate-pulse' : 
                job.status === 'paused' ? 'bg-amber-400' : 
                'bg-aurora-purple'
              }`} />
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
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>~{job.timeRemaining} remaining</span>
                </div>
              )}
            </div>
            
            <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  job.status === 'paused' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600' 
                    : 'bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${job.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div className="flex gap-2 self-end sm:self-auto">
            <Button 
              variant="outline" 
              className="border-aurora-blue/30 hover:border-aurora-blue/60 text-aurora-blue"
              onClick={() => handlePause(job.id)}
            >
              {job.status === 'paused' ? 'Resume' : 'Pause'}
            </Button>
            <Button 
              variant="outline" 
              className="border-red-500/30 hover:border-red-500/60 text-red-500"
              onClick={() => handleCancel(job.id)}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
