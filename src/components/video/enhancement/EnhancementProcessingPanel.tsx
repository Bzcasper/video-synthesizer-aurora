
import React from 'react';
import { useVideoEnhancements } from '@/hooks/use-video-enhancements';
import { EmptyState } from '../common/EmptyState';
import { EnhancementJobCard } from './EnhancementJobCard';

export interface EnhancementJob {
  id: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimated_completion_time: string | null;
  title: string;
  remainingTime: string;
}

export const EnhancementProcessingPanel: React.FC = () => {
  const { enhancementProgress } = useVideoEnhancements();
  
  const activeJobs = Object.values(enhancementProgress)
    .filter((job) => job.status === 'processing' || job.status === 'pending')
    .map(job => ({
      ...job,
      title: `Enhancement #${job.id}`,
      remainingTime: job.estimated_completion_time 
        ? new Date(job.estimated_completion_time).toLocaleTimeString() 
        : 'Calculating...'
    })) as EnhancementJob[];
  
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
