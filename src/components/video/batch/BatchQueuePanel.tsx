
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
      remainingTime: 750 // 12:30 in seconds
    },
    {
      id: 'job-2',
      title: 'Urban night timelapse',
      progress: 10,
      status: 'pending',
      remainingTime: 1545 // 25:45 in seconds
    },
    {
      id: 'job-3',
      title: 'Mountain forest aerial',
      progress: 0,
      status: 'pending',
      remainingTime: 1935 // 32:15 in seconds
    }
  ]);
  
  const handleCancel = (jobId: string) => {
    setActiveJobs(activeJobs.filter(job => job.id !== jobId));
  };
  
  const handleSettings = (jobId: string) => {
    // Settings functionality to be implemented
    console.log(`Open settings for job: ${jobId}`);
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
          onCancel={handleCancel}
          onSettings={handleSettings}
          index={index}
        />
      ))}
    </div>
  );
};
