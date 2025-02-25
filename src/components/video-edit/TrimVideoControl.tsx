
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScissorsIcon } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type VideoJob = Database["public"]["Tables"]["video_jobs"]["Row"];

interface TrimVideoControlProps {
  duration: number;
  startTime: number;
  endTime: number;
  onStartTimeChange: (value: number) => void;
  onEndTimeChange: (value: number) => void;
  onApplyTrim: () => void;
  isProcessing?: boolean;
  video: VideoJob;
}

const TrimVideoControl = ({
  duration,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onApplyTrim,
  isProcessing = false,
  video
}: TrimVideoControlProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <ScissorsIcon className="w-5 h-5 text-aurora-blue" />
          Trim Video
        </h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Start Time: {formatTime(startTime)}</label>
          <Slider
            value={[startTime]}
            min={0}
            max={endTime}
            step={0.1}
            onValueChange={([value]) => onStartTimeChange(value)}
            className="my-4"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">End Time: {formatTime(endTime)}</label>
          <Slider
            value={[endTime]}
            min={startTime}
            max={duration}
            step={0.1}
            onValueChange={([value]) => onEndTimeChange(value)}
            className="my-4"
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={onApplyTrim}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <ScissorsIcon className="w-4 h-4 mr-2" />
                Apply Trim
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TrimVideoControl;
