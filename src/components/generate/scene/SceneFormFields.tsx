
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Scene, SceneType, CameraMotion } from './types';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

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
  // Scene types with friendly labels
  const sceneTypes: { value: SceneType; label: string }[] = [
    { value: 'realistic_outdoor', label: 'Realistic Outdoor' },
    { value: 'cinematic_close_up', label: 'Cinematic Close-up' },
    { value: 'abstract_scene', label: 'Abstract Scene' },
    { value: 'sci_fi_scene', label: 'Sci-fi Scene' },
    { value: 'animation_scene', label: 'Animation Scene' },
  ];

  // Camera motion types with friendly labels
  const cameraMotions: { value: CameraMotion; label: string }[] = [
    { value: 'static', label: 'Static' },
    { value: 'pan_left', label: 'Pan Left' },
    { value: 'pan_right', label: 'Pan Right' },
    { value: 'tilt_up', label: 'Tilt Up' },
    { value: 'tilt_down', label: 'Tilt Down' },
    { value: 'zoom_in', label: 'Zoom In' },
    { value: 'zoom_out', label: 'Zoom Out' },
    { value: 'dolly', label: 'Dolly' },
  ];

  // Transition types
  const transitionTypes = [
    { value: 'fade', label: 'Fade' },
    { value: 'wipe', label: 'Wipe' },
    { value: 'dissolve', label: 'Dissolve' },
    { value: 'none', label: 'None' },
  ];

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateScene({ prompt: e.target.value });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateScene({ duration: Number(e.target.value) || 1 });
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-gradient mb-0">Scene {index + 1}</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Each scene will be rendered as a separate segment in your final video.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Scene Description/Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={`scene-prompt-${index}`} className="text-sm font-medium text-gray-200">
            Scene Description
          </label>
          <span className="text-xs text-gray-400">
            {scene.prompt.length}/200
          </span>
        </div>
        <Textarea
          id={`scene-prompt-${index}`}
          value={scene.prompt}
          onChange={handlePromptChange}
          placeholder="Describe what should appear in this scene..."
          className="bg-white/5 border-white/10 text-white resize-none h-20"
          maxLength={200}
        />
      </div>

      {/* Scene Type */}
      <div className="space-y-2">
        <label htmlFor={`scene-type-${index}`} className="text-sm font-medium text-gray-200">
          Scene Type
        </label>
        <Select 
          value={scene.sceneType} 
          onValueChange={(value) => updateScene({ sceneType: value as SceneType })}
        >
          <SelectTrigger id={`scene-type-${index}`}>
            <SelectValue placeholder="Select scene type" />
          </SelectTrigger>
          <SelectContent>
            {sceneTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Camera Motion */}
      <div className="space-y-2">
        <label htmlFor={`camera-motion-${index}`} className="text-sm font-medium text-gray-200">
          Camera Motion
        </label>
        <Select 
          value={scene.cameraMotion} 
          onValueChange={(value) => updateScene({ cameraMotion: value as CameraMotion })}
        >
          <SelectTrigger id={`camera-motion-${index}`}>
            <SelectValue placeholder="Select camera motion" />
          </SelectTrigger>
          <SelectContent>
            {cameraMotions.map((motion) => (
              <SelectItem key={motion.value} value={motion.value}>
                {motion.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={`scene-duration-${index}`} className="text-sm font-medium text-gray-200">
            Duration (seconds)
          </label>
          <span className="text-xs text-gray-400">{scene.duration}s</span>
        </div>
        <Input
          id={`scene-duration-${index}`}
          type="number"
          min={1}
          max={30}
          value={scene.duration}
          onChange={handleDurationChange}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      {/* Transition Type (not for the last scene) */}
      {!isLastScene && (
        <div className="space-y-2">
          <label htmlFor={`transition-${index}`} className="text-sm font-medium text-gray-200">
            Transition to Next Scene
          </label>
          <Select 
            value={scene.transitionType || 'fade'} 
            onValueChange={(value) => updateScene({ transitionType: value })}
          >
            <SelectTrigger id={`transition-${index}`}>
              <SelectValue placeholder="Select transition" />
            </SelectTrigger>
            <SelectContent>
              {transitionTypes.map((transition) => (
                <SelectItem key={transition.value} value={transition.value}>
                  {transition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
