
import React from 'react';
import { useVideoEnhancements } from '@/hooks/use-video-enhancements';
import { EmptyState } from '../common/EmptyState';
import { EnhancementJobCard } from './EnhancementJobCard';
import type { VideoJobStatus } from '@/hooks/video/types';

// Define an interface for the enhancement job
interface JobProgress {
  id: string;
  progress: number;
  status: VideoJobStatus;
  estimated_completion_time: string | null;
}

export const EnhancementProcessingPanel: React.FC = () => {
  const { enhancementProgress } = useVideoEnhancements();
  
  const activeJobs = Object.values(enhancementProgress)
    .filter((job) => job.status === 'processing' || job.status === 'pending')
    .map(job => ({
      id: job.id,
      title: `Enhancement #${job.id}`,
      progress: job.progress,
      status: job.status,
      remainingTime: job.estimated_completion_time 
        ? Math.floor((new Date(job.estimated_completion_time).getTime() - Date.now()) / 1000)
        : 300 // Default to 5 minutes if no estimate available
    }));
  
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
    <div className="space-y-4">
      {activeJobs.map((job) => (
        <EnhancementJobCard 
          key={job.id} 
          job={job} 
          onCancel={(jobId) => console.log('Cancel job', jobId)}
          onSettings={(jobId) => console.log('Open settings for job', jobId)}
        />
      ))}
    </div>
  );
};
