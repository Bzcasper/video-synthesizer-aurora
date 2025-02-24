
import React from 'react';
import { Button } from "@/components/ui/button";

interface VideoJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output_url: string | null;
  created_at: string;
  error_message?: string;
}

interface VideoJobsListProps {
  jobs?: VideoJob[];
}

const VideoJobsList = ({ jobs }: VideoJobsListProps) => {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Your Videos</h2>
      <div className="space-y-2">
        {jobs?.map((job) => (
          <div 
            key={job.id} 
            className="p-4 rounded-lg bg-card border flex items-center justify-between"
          >
            <div>
              <p className="font-medium">Job ID: {job.id.slice(0, 8)}</p>
              <p className="text-sm text-muted-foreground">
                Status: {job.status}
              </p>
            </div>
            {job.output_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={job.output_url} target="_blank" rel="noopener noreferrer">
                  View Video
                </a>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoJobsList;
