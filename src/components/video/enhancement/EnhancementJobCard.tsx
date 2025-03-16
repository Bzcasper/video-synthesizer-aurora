
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/video/common/ProgressBar";
import { TimeRemaining } from "@/components/video/common/TimeRemaining";
import { StatusBadge } from '@/components/video/StatusBadge';
import { Cog, X } from 'lucide-react';
import { type VideoJobStatus } from '@/hooks/video/types';
import { EnhancementJob } from './EnhancementProcessingPanel';

interface EnhancementJobCardProps {
  job: EnhancementJob;
  onCancel: (id: string) => void;
  onSettings: (id: string) => void;
}

export const EnhancementJobCard: React.FC<EnhancementJobCardProps> = ({
  job,
  onCancel,
  onSettings
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
    <Card className="w-full glass-panel hover-glow">
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
              timeRemaining={job.remainingTime} 
            />
          </>
        )}
        
        <div className="flex justify-end gap-2 mt-3">
          {(job.status === 'processing' || job.status === 'pending') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCancel}
              aria-label="Cancel enhancement"
            >
              <X className="w-4 h-4 mr-1" />
              <span className="text-xs">Cancel</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSettings}
            aria-label="Enhancement settings"
          >
            <Cog className="w-4 h-4 mr-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
