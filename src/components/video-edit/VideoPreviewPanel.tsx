
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type VideoJob = Database["public"]["Tables"]["video_jobs"]["Row"];

interface VideoPreviewPanelProps {
  video: VideoJob;
  isPlaying: boolean;
  onPlayPause: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPreviewPanel = ({ video, isPlaying, onPlayPause, videoRef }: VideoPreviewPanelProps) => {
  return (
    <Card className="glass-panel p-6 space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
        {video.output_url ? (
          <>
            <video
              ref={videoRef}
              src={video.output_url}
              className="w-full h-full object-contain"
              onEnded={() => onPlayPause()}
            />
            <Button
              onClick={onPlayPause}
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
  );
};

export default VideoPreviewPanel;
