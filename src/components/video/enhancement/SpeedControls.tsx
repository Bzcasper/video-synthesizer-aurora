import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SpeedControlsProps {
  speedFactor: number;
  setSpeedFactor: (speed: number) => void;
}

export const SpeedControls: React.FC<SpeedControlsProps> = ({
  speedFactor,
  setSpeedFactor,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label
          htmlFor="speed-factor"
          className="block text-sm font-medium mb-2"
        >
          Speed Factor
        </Label>
        <Select
          value={speedFactor.toString()}
          onValueChange={(value) => setSpeedFactor(parseFloat(value))}
        >
          <SelectTrigger
            id="speed-factor"
            name="speed-factor"
            className="w-full max-w-xs"
          >
            <SelectValue placeholder="Select speed factor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">0.5x (Slow Motion)</SelectItem>
            <SelectItem value="1">1x (Normal)</SelectItem>
            <SelectItem value="1.5">1.5x (Fast)</SelectItem>
            <SelectItem value="2">2x (Very Fast)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Optionally, we could add a slider for more precise control */}
      {/* <div className="pt-2">
        <Slider
          value={[speedFactor]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={(values) => setSpeedFactor(values[0])}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5x</span>
          <span>{speedFactor.toFixed(1)}x</span>
          <span>2.0x</span>
        </div>
      </div> */}
    </div>
  );
};
