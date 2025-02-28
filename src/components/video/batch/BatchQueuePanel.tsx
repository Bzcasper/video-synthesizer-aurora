
import React from 'react';
import { EmptyState } from '../common/EmptyState';
import { BatchJobCard, BatchJob } from './BatchJobCard';

export const BatchQueuePanel: React.FC = () => {
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
      <EmptyState 
        icon="batch"
        title="No active batch processing jobs"
        description="Generate or enhance videos to add them to the queue"
        actionButton={{
          label: "Generate New Video",
          icon: "generate",
          onClick: () => window.location.href = '/dashboard/generate'
        }}
      />
    );
  }
  
  return (
    <div className="space-y-fib-3">
      {activeJobs.map((job, index) => (
        <BatchJobCard 
          key={job.id}
          job={job}
          onPause={handlePause}
          onCancel={handleCancel}
          index={index}
        />
      ))}
    </div>
  );
};
