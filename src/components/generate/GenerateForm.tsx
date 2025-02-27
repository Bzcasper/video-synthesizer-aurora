
import React, { useCallback, useState } from 'react';
import VideoDescriptionInput from './VideoDescriptionInput';
import GenerateButton from './GenerateButton';
import ActionButtons from './ActionButtons';
import { Card } from "@/components/ui/card";
import { SceneEditor } from './SceneEditor';
import DurationSlider from './DurationSlider';
import VideoStyleOption from './VideoStyleOption';
import { type Database } from "@/integrations/supabase/types";

type SceneType = Database["public"]["Enums"]["scene_type"];
type CameraMotion = Database["public"]["Enums"]["camera_motion_type"];

interface Scene {
  prompt: string;
  sceneType: SceneType;
  cameraMotion: CameraMotion;
  duration: number;
  sequenceOrder: number;
  transitionType?: string;
}

export const videoStyles = [
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Professional movie-like quality with dramatic shots',
  },
  {
    id: 'anime',
    label: 'Anime',
    description: 'Japanese animation style with vibrant colors',
  },
  {
    id: 'realistic',
    label: 'Realistic',
    description: 'True-to-life footage with natural lighting',
  },
  {
    id: 'artistic',
    label: 'Artistic',
    description: 'Creative and experimental visual effects',
  },
];

interface GenerateFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  style: string;
  setStyle: (style: string) => void;
  isGenerating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
}

const GenerateForm = ({
  prompt,
  setPrompt,
  duration,
  setDuration,
  style,
  setStyle,
  isGenerating,
  onSubmit,
  scenes,
  setScenes,
}: GenerateFormProps) => {
  // State for advanced settings visibility
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Validate if form can be submitted
  const isFormValid = prompt.trim().length > 0;
  
  // Toggle advanced settings visibility
  const toggleAdvancedSettings = useCallback(() => {
    setShowAdvancedSettings(prev => !prev);
  }, []);

  return (
    <form className="space-y-6" onSubmit={onSubmit} aria-label="Video generation form">
      {/* Video Description Input */}
      <VideoDescriptionInput 
        value={prompt} 
        onChange={setPrompt} 
        disabled={isGenerating} 
      />

      {/* Main Generate Button */}
      <GenerateButton 
        isGenerating={isGenerating} 
        disabled={!isFormValid} 
      />

      {/* Secondary Action Buttons */}
      <ActionButtons 
        disabled={isGenerating}
        onDetailsClick={toggleAdvancedSettings}
        onEnhanceClick={() => {
          /* Implement enhancement functionality if needed */
        }}
      />

      {/* Advanced Settings (conditionally displayed) */}
      {showAdvancedSettings && (
        <Card className="p-4 bg-white/5 border-white/10 space-y-6">
          <SceneEditor scenes={scenes} setScenes={setScenes} />
          <DurationSlider duration={duration} onDurationChange={setDuration} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoStyles.map((styleOption) => (
              <VideoStyleOption
                key={styleOption.id}
                {...styleOption}
                isSelected={style === styleOption.id}
                onSelect={setStyle}
              />
            ))}
          </div>
        </Card>
      )}
    </form>
  );
};

export default GenerateForm;
