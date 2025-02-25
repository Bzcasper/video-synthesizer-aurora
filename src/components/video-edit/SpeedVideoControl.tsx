
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Timer, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface SpeedVideoControlProps {
  videoId: string;
  onSubmit: (params: { speed: number }) => void;
  isProcessing?: boolean;
}

const SpeedVideoControl = ({ videoId, onSubmit, isProcessing = false }: SpeedVideoControlProps) => {
  const [speed, setSpeed] = useState(1);

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>0.5x</span>
          <span>{speed.toFixed(1)}x</span>
          <span>2.0x</span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={handleSpeedChange}
          min={0.5}
          max={2}
          step={0.1}
          className="[&_[role=slider]]:bg-aurora-blue [&_[role=slider]]:border-aurora-blue"
        />
      </div>

      <Button
        className="w-full bg-aurora-blue hover:bg-aurora-blue/80 text-white"
        onClick={() => onSubmit({ speed })}
        disabled={isProcessing || speed === 1}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Applying...
          </>
        ) : (
          "Apply Speed"
        )}
      </Button>
    </div>
  );
};

export default SpeedVideoControl;
