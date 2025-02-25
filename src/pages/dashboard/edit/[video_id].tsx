
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VideoPreviewPanel from '@/components/video-edit/VideoPreviewPanel';
import EditingControlsPanel from '@/components/video-edit/EditingControlsPanel';
import type { Database } from "@/integrations/supabase/types";

type VideoJob = Database["public"]["Tables"]["video_jobs"]["Row"];

const VideoEditPage = () => {
  const { video_id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const { data: video, isLoading, error } = useQuery({
    queryKey: ['video', video_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_jobs')
        .select('*')
        .eq('id', video_id)
        .single();

      if (error) {
        toast({
          title: "Error loading video",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      return data as VideoJob;
    }
  });

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin-slow">
          <img
            src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
            alt="Loading..."
            className="w-16 h-16 filter brightness-150"
          />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="text-center text-red-500">
        Error loading video. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-gradient bg-gradient-glow">
          Edit Video
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VideoPreviewPanel
          video={video}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          videoRef={videoRef}
        />
        <EditingControlsPanel video={video} />
      </div>
    </div>
  );
};

export default VideoEditPage;
