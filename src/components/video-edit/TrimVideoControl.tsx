
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type VideoJob = Database["public"]["Tables"]["video_jobs"]["Row"];

interface TrimVideoControlProps {
  video: VideoJob;
  onTrimApply: (startTime: number, endTime: number) => void;
}

const TrimVideoControl = ({ video, onTrimApply }: TrimVideoControlProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(video.duration || 30);
  const { toast } = useToast();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrimApply = async () => {
    try {
      await onTrimApply(trimStart, trimEnd);
      toast({
        title: "Trim request submitted",
        description: `Video will be trimmed from ${trimStart}s to ${trimEnd}s`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit trim request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-4 glass-panel">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-orbitron text-gradient bg-gradient-glow">
          Trim Video
        </h3>
        <Button
          onClick={handlePlayPause}
          variant="ghost"
          size="icon"
          className="hover:bg-aurora-blue/10"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-aurora-blue" />
          ) : (
            <Play className="h-5 w-5 text-aurora-blue" />
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-400">Trim Range</Label>
          <div className="h-16 relative">
            <div className="absolute inset-x-0 h-2 top-1/2 -translate-y-1/2 bg-aurora-blue/10 rounded-full">
              <div
                className="absolute h-full bg-aurora-blue/50 rounded-full"
                style={{
                  left: `${(trimStart / (video.duration || 30)) * 100}%`,
                  right: `${100 - ((trimEnd / (video.duration || 30)) * 100)}%`,
                }}
              />
            </div>
            <Slider
              max={video.duration || 30}
              step={0.1}
              value={[trimStart, trimEnd]}
              onValueChange={([start, end]) => {
                setTrimStart(start);
                setTrimEnd(end);
              }}
              className="relative z-10"
            />
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-400">
          <span>{trimStart.toFixed(1)}s</span>
          <span>{trimEnd.toFixed(1)}s</span>
        </div>

        <Button
          onClick={handleTrimApply}
          className="w-full bg-aurora-blue hover:bg-aurora-blue/90 text-black font-medium"
        >
          Apply Trim
        </Button>
      </div>
    </div>
  );
};

export default TrimVideoControl;
