
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface SpeedVideoControlProps {
  onApplySpeed: (speed: number) => Promise<void>;
  isProcessing?: boolean;
}

const SpeedVideoControl = ({ onApplySpeed, isProcessing = false }: SpeedVideoControlProps) => {
  const [speed, setSpeed] = useState(1);

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  return (
    <Card className="p-4 space-y-4 bg-black/30 border-white/10">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Timer className="w-5 h-5 text-aurora-blue" />
        Adjust Speed
      </h3>

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
          onClick={() => onApplySpeed(speed)}
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
    </Card>
  );
};

export default SpeedVideoControl;
