
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface DurationSliderProps {
  duration: number;
  onDurationChange: (duration: number) => void;
}

const DurationSlider = ({ duration, onDurationChange }: DurationSliderProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-200">Duration (seconds)</label>
      <div className="pt-2">
        <Slider
          value={[duration]}
          onValueChange={(values) => onDurationChange(values[0])}
          min={5}
          max={60}
          step={5}
          className="py-2"
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>5s</span>
          <span>{duration}s (selected)</span>
          <span>60s</span>
        </div>
      </div>
    </div>
  );
};

export default DurationSlider;
