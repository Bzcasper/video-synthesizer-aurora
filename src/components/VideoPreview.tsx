import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack } from "lucide-react";

const VideoPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Video Preview</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setProgress([0])}>
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <div className="flex-1">
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
          />
        </div>

        <span className="text-sm text-muted-foreground min-w-[4rem]">
          00:00:00
        </span>
      </div>
    </div>
  );
};

export default VideoPreview;
