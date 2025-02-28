
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Scene, SceneType, CameraMotion } from './types';

interface SceneFormFieldsProps {
  scene: Scene;
  index: number;
  isLastScene: boolean;
  updateScene: (updates: Partial<Scene>) => void;
}

export const SceneFormFields: React.FC<SceneFormFieldsProps> = ({
  scene,
  index,
  isLastScene,
  updateScene,
}) => {
  return (
    <>
      <div className="flex-1">
        <Label htmlFor={`scene-description-${index}`} className="text-sm font-medium mb-2 block">
          Scene Description
        </Label>
        <Textarea
          id={`scene-description-${index}`}
          name={`scene-description-${index}`}
          value={scene.prompt}
          onChange={(e) => updateScene({ prompt: e.target.value })}
          placeholder="Describe the scene..."
          className="h-[100px]"
          aria-describedby={`scene-description-hint-${index}`}
        />
        <p id={`scene-description-hint-${index}`} className="sr-only">
          Enter a detailed description of the scene you want to create
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`scene-type-${index}`} className="text-sm font-medium mb-2 block">
            Scene Type
          </Label>
          <Select
            value={scene.sceneType}
            onValueChange={(value: SceneType) => 
              updateScene({ sceneType: value })}
          >
            <SelectTrigger id={`scene-type-${index}`} name={`scene-type-${index}`}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="realistic_outdoor">Realistic Outdoor</SelectItem>
              <SelectItem value="scifi_interior">Sci-fi Interior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`camera-motion-${index}`} className="text-sm font-medium mb-2 block">
            Camera Motion
          </Label>
          <Select
            value={scene.cameraMotion}
            onValueChange={(value: CameraMotion) => 
              updateScene({ cameraMotion: value })}
          >
            <SelectTrigger id={`camera-motion-${index}`} name={`camera-motion-${index}`}>
              <SelectValue placeholder="Select motion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="static">Static</SelectItem>
              <SelectItem value="pan_left">Pan Left</SelectItem>
              <SelectItem value="pan_right">Pan Right</SelectItem>
              <SelectItem value="zoom_in">Zoom In</SelectItem>
              <SelectItem value="zoom_out">Zoom Out</SelectItem>
              <SelectItem value="tracking">Tracking Shot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`scene-duration-${index}`} className="text-sm font-medium mb-2 block">
            Duration (seconds)
          </Label>
          <Input
            id={`scene-duration-${index}`}
            name={`scene-duration-${index}`}
            type="number"
            min={1}
            max={30}
            value={scene.duration}
            onChange={(e) => updateScene({ 
              duration: Math.max(1, Math.min(30, parseInt(e.target.value) || 1))
            })}
          />
        </div>
      </div>

      {!isLastScene && (
        <div>
          <Label htmlFor={`transition-type-${index}`} className="text-sm font-medium mb-2 block">
            Transition
          </Label>
          <Select
            value={scene.transitionType || 'none'}
            onValueChange={(value) => 
              updateScene({ transitionType: value === 'none' ? undefined : value })}
          >
            <SelectTrigger id={`transition-type-${index}`} name={`transition-type-${index}`}>
              <SelectValue placeholder="Select transition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="dissolve">Dissolve</SelectItem>
              <SelectItem value="wipe">Wipe</SelectItem>
              <SelectItem value="zoom">Zoom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};
