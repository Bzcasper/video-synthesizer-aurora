
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/video/common/ProgressBar";
import { TimeRemaining } from "@/components/video/common/TimeRemaining";
import { StatusBadge } from '@/components/video/StatusBadge';
import { Cog, X } from 'lucide-react';
import { type VideoJobStatus } from '@/hooks/video/types';

export interface BatchJob {
  id: string;
  title: string;
  progress: number;
  status: VideoJobStatus;
  timeRemaining: string | number;
  thumbnailUrl?: string;
}

interface BatchJobCardProps {
  job: BatchJob;
  onCancel: (id: string) => void;
  onSettings: (id: string) => void;
  index?: number;
}

export const BatchJobCard: React.FC<BatchJobCardProps> = ({
  job,
  onCancel,
  onSettings,
  index
}) => {
  const handleCancel = () => {
    if (job.status === 'processing' || job.status === 'pending') {
      onCancel(job.id);
    }
  };

  const handleSettings = () => {
    onSettings(job.id);
  };

  return (
    <Card className="w-full glass-panel hover-glow transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-sm sm:text-base truncate mr-4">{job.title}</h3>
          <StatusBadge status={job.status} />
        </div>
        
        {job.status === 'processing' && (
          <>
            <ProgressBar 
              progress={job.progress} 
              status="processing"
            />
            <TimeRemaining 
              timeRemaining={typeof job.timeRemaining === 'string' ? parseInt(job.timeRemaining) : job.timeRemaining} 
            />
          </>
        )}
        
        <div className="flex justify-end gap-2 mt-3">
          {(job.status === 'processing' || job.status === 'pending') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCancel}
              aria-label="Cancel processing"
              className="flex items-center gap-1 text-gray-300 hover:text-red-400 hover:bg-red-400/10 hover:shadow-[0_0_8px_rgba(248,113,113,0.4)] transition-all duration-300"
            >
              <X className="w-4 h-4" />
              <span className="text-xs">Cancel</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettings}
            aria-label="Batch job settings"
            className="flex items-center gap-1 text-gray-300 hover:text-aurora-blue hover:bg-aurora-blue/10 hover:shadow-[0_0_8px_rgba(0,166,255,0.4)] transition-all duration-300"
          >
            <Cog className="w-4 h-4" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
