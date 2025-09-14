import React from "react";
import { useVideoEnhancements } from "@/hooks/use-video-enhancements";
import { EmptyState } from "../common/EmptyState";
import { EnhancementJobCard } from "./EnhancementJobCard";
import { type VideoJobStatus } from "@/hooks/video/types";

export interface EnhancementJob {
  id: string;
  progress: number;
  status: VideoJobStatus;
  estimated_completion_time: string | null;
  title: string;
  remainingTime: number;
}

export const EnhancementProcessingPanel: React.FC = () => {
  const { enhancementProgress } = useVideoEnhancements();

  const calculateRemainingSeconds = (job: any): number => {
    if (!job.estimated_completion_time) return 300; // Default 5 minutes

    const estimatedTime = new Date(job.estimated_completion_time).getTime();
    const currentTime = new Date().getTime();
    return Math.max(0, Math.floor((estimatedTime - currentTime) / 1000));
  };

  const activeJobs = Object.values(enhancementProgress)
    .filter((job) => job.status === "processing" || job.status === "pending")
    .map((job) => ({
      ...job,
      title: `Enhancement #${job.id}`,
      remainingTime: calculateRemainingSeconds(job),
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
        <EnhancementJobCard
          key={job.id}
          job={job}
          onCancel={() => console.log("Cancel job", job.id)}
          onSettings={() => console.log("Settings for job", job.id)}
        />
      ))}
    </div>
  );
};
