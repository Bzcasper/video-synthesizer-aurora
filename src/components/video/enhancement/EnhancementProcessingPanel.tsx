
import React from 'react';
import { useVideoEnhancements } from '@/hooks/use-video-enhancements';
import { EmptyState } from '../common/EmptyState';
import { EnhancementJobCard } from './EnhancementJobCard';

export const EnhancementProcessingPanel: React.FC = () => {
  const { enhancementProgress } = useVideoEnhancements();
  
  const activeJobs = Object.values(enhancementProgress).filter(
    (job) => job.status === 'processing' || job.status === 'pending'
  );
  
  if (activeJobs.length === 0) {
    return (
      <EmptyState 
        icon="processing"
        title="No active enhancement jobs"
        description="Select a video and apply enhancements to see processing status here"
      />
    );
  }
  
  return (
    <div className="space-y-fib-4">
      {activeJobs.map((job) => (
        <EnhancementJobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
