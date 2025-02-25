
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
type StatusFilter = 'all' | VideoJobStatus;

interface EmptyVideosProps {
  statusFilter: StatusFilter;
}

export const EmptyVideos = ({ statusFilter }: EmptyVideosProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-12 bg-black/50 border-white/10">
      <div className="text-center space-y-4">
        <p className="text-xl text-gray-400">No videos found</p>
        <p className="text-sm text-gray-500">
          {statusFilter !== 'all' 
            ? `No videos with status "${statusFilter}". Try changing the filter.`
            : 'Start by generating a new video or uploading one to edit'}
        </p>
        <Button
          onClick={() => navigate('/dashboard/generate')}
          className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple text-white shadow-neon mt-4 transform transition-all duration-300 hover:scale-105"
        >
          Generate New Video
        </Button>
      </div>
    </Card>
  );
};
