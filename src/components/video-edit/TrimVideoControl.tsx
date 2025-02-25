
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScissorsIcon } from "lucide-react";

interface TrimVideoControlProps {
  videoId: string;
  onSubmit: (params: { startTime: number; endTime: number }) => void;
  isProcessing?: boolean;
}

const TrimVideoControl = ({
  videoId,
  onSubmit,
  isProcessing = false,
}: TrimVideoControlProps) => {
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState(60); // Default duration
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Start Time: {formatTime(startTime)}</label>
        <Slider
          value={[startTime]}
          min={0}
          max={endTime}
          step={0.1}
          onValueChange={([value]) => setStartTime(value)}
          className="my-4"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">End Time: {formatTime(endTime)}</label>
        <Slider
          value={[endTime]}
          min={startTime}
          max={60}
          step={0.1}
          onValueChange={([value]) => setEndTime(value)}
          className="my-4"
        />
      </div>

      <div className="pt-2">
        <Button
          onClick={() => onSubmit({ startTime, endTime })}
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
  );
};

export default TrimVideoControl;
