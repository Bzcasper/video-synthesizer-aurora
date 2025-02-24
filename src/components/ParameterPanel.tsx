
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const ParameterPanel = () => {
  const [duration, setDuration] = useState([10]);
  const [fps, setFps] = useState([30]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Parameters</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Duration (seconds)</Label>
          <Slider
            value={duration}
            onValueChange={setDuration}
            min={1}
            max={60}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{duration[0]}s</p>
        </div>

        <div className="space-y-2">
          <Label>Frames per Second</Label>
          <Slider
            value={fps}
            onValueChange={setFps}
            min={24}
            max={60}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{fps[0]} FPS</p>
        </div>

        <div className="space-y-2">
          <Label>Style Prompt</Label>
          <Input 
            placeholder="Enter style description..."
            className="bg-background/50"
          />
        </div>
      </div>
    </div>
  );
};

export default ParameterPanel;
