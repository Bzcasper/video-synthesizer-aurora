
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Scene } from './types';

interface SceneFormFieldsProps {
  scene: Scene;
  index: number;
  onSceneChange: (index: number, field: keyof Scene, value: any) => void;
}

export const SceneFormFields: React.FC<SceneFormFieldsProps> = ({ 
  scene, 
  index, 
  onSceneChange 
}) => {
  // Update style options to match the expected type
  const styleOptions = [
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "fantasy", label: "Fantasy" },
    { value: "realistic_outdoor", label: "Realistic Outdoor" },
    { value: "scifi_interior", label: "Sci-Fi Interior" }
  ];

  // Update camera movement options to match the expected type
  const cameraOptions = [
    { value: "static", label: "Static" },
    { value: "pan_left", label: "Pan Left" },
    { value: "pan_right", label: "Pan Right" },
    { value: "zoom_in", label: "Zoom In" },
    { value: "zoom_out", label: "Zoom Out" },
    { value: "tracking", label: "Tracking Shot" }
  ];

  return (
    <div className="space-y-4 p-4 border border-white/10 rounded-md bg-black/20">
      {/* Scene prompt field */}
      <div className="space-y-2">
        <Label htmlFor={`scene-${index}-prompt`}>Scene Description</Label>
        <Textarea
          id={`scene-${index}-prompt`}
          value={scene.prompt}
          onChange={(e) => onSceneChange(index, 'prompt', e.target.value)}
          placeholder="Describe what happens in this scene"
          rows={3}
        />
      </div>

      {/* Scene type selector */}
      <div className="space-y-2">
        <Label htmlFor={`scene-${index}-type`}>Scene Type</Label>
        <Select
          value={scene.sceneType}
          onValueChange={(value) => onSceneChange(index, 'sceneType', value)}
        >
          <SelectTrigger id={`scene-${index}-type`}>
            <SelectValue placeholder="Select a scene type" />
          </SelectTrigger>
          <SelectContent>
            {styleOptions.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Camera movement selector */}
      <div className="space-y-2">
        <Label htmlFor={`scene-${index}-camera`}>Camera Movement</Label>
        <Select
          value={scene.cameraMotion}
          onValueChange={(value) => onSceneChange(index, 'cameraMotion', value)}
        >
          <SelectTrigger id={`scene-${index}-camera`}>
            <SelectValue placeholder="Select camera movement" />
          </SelectTrigger>
          <SelectContent>
            {cameraOptions.map((camera) => (
              <SelectItem key={camera.value} value={camera.value}>
                {camera.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Scene duration slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor={`scene-${index}-duration`}>Duration (seconds)</Label>
          <span className="text-sm text-gray-400">{scene.duration}s</span>
        </div>
        <Slider
          id={`scene-${index}-duration`}
          value={[scene.duration]}
          min={1}
          max={15}
          step={1}
          onValueChange={(value) => onSceneChange(index, 'duration', value[0])}
        />
      </div>
    </div>
  );
};
