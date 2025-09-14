import React, { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface VideoPreviewPanelProps {
  videoUrl: string;
  startTime?: number;
  endTime?: number;
  playbackSpeed?: number;
  filter?: string;
}

const VideoPreviewPanel = ({
  videoUrl,
  startTime = 0,
  endTime,
  playbackSpeed = 1,
  filter,
}: VideoPreviewPanelProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (!endTime) {
        video.currentTime = startTime;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoUrl, endTime, startTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = startTime;
  }, [startTime]);

  const getFilterClass = () => {
    switch (filter) {
      case "vintage":
        return "sepia brightness-90 contrast-110";
      case "cinematic":
        return "contrast-125 saturate-150";
      case "anime":
        return "saturate-200 brightness-110";
      default:
        return "";
    }
  };

  return (
    <Card className="glass-panel p-4 w-full">
      <div className="aspect-video relative rounded-lg overflow-hidden bg-black/20">
        <video
          ref={videoRef}
          src={videoUrl}
          className={`w-full h-full object-contain transition-all duration-300 ${getFilterClass()}`}
          controls
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (!video) return;

            if (endTime && video.currentTime >= endTime) {
              video.currentTime = startTime;
            }
          }}
        />
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <div className="flex justify-between items-center">
          <span>Preview with current edits applied</span>
          <span>{Math.floor(duration)}s</span>
        </div>
      </div>
    </Card>
  );
};

export default VideoPreviewPanel;
