
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Pause } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

  const togglePlayPause = () => {
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
        {/* Left Panel: Video Preview */}
        <Card className="glass-panel p-6 space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
            {video.output_url ? (
              <>
                <video
                  ref={videoRef}
                  src={video.output_url}
                  className="w-full h-full object-contain"
                  onEnded={() => setIsPlaying(false)}
                />
                <Button
                  onClick={togglePlayPause}
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2
                           bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-gray-400">No preview available</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Original Video</h3>
            <p className="text-sm text-gray-400">{video.prompt}</p>
          </div>
        </Card>

        {/* Right Panel: Editing Controls */}
        <Card className="glass-panel p-6 space-y-6">
          <h2 className="text-2xl font-orbitron text-gradient bg-gradient-glow">
            Editing Controls
          </h2>
          <div className="space-y-4">
            {/* Edit control sections will be added here */}
            <p className="text-gray-400">
              Editing controls will be implemented in the next steps.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VideoEditPage;
