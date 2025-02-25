
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Video, Loader2, Sparkles, FileVideo, Wand2 } from "lucide-react";
import VideoStyleOption from './VideoStyleOption';
import DurationSlider from './DurationSlider';
import { Card } from "@/components/ui/card";
import { SceneEditor } from './SceneEditor';
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
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Video Description */}
      <div className="space-y-3 w-full">
        <label className="text-base font-medium text-gray-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-aurora-blue" />
          Video Description
        </label>
        <Textarea
          placeholder="Describe your video in detail. For example: A serene mountain landscape at sunset, with clouds moving in timelapse..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-[144px] w-full bg-white/5 border-white/10 text-white focus:ring-aurora-blue 
                   hover:border-aurora-blue/50 transition-golden"
        />
        <p className="text-sm text-gray-400">
          Be specific about what you want to see in your video. Include details about mood, lighting, and movement.
        </p>
      </div>

      {/* Main Generate Button */}
      <Button
        type="submit"
        disabled={isGenerating || !prompt.trim()}
        className="w-full h-16 text-lg bg-aurora-blue hover:bg-aurora-blue/90 text-white 
                 shadow-[0_0_30px_rgba(0,166,255,0.3)] hover:shadow-[0_0_40px_rgba(0,166,255,0.5)]
                 transition-golden duration-golden font-semibold"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Video className="mr-2 h-6 w-6" />
            Generate Video
          </>
        )}
      </Button>

      {/* Secondary Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="h-12 text-sm hover:bg-aurora-purple/10"
          onClick={() => {/* Handle video details click */}}
        >
          <FileVideo className="mr-2 h-5 w-5" />
          Video Details
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 text-sm hover:bg-aurora-blue/10"
          onClick={() => {/* Handle enhance video click */}}
        >
          <Wand2 className="mr-2 h-5 w-5" />
          Enhance Video
        </Button>
      </div>

      {/* Hidden until needed */}
      <div className="hidden">
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
      </div>
    </form>
  );
};

export default GenerateForm;
