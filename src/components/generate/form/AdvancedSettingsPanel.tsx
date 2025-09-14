import React from "react";
import { Card } from "@/components/ui/card";
import { SceneEditor } from "@/components/generate/SceneEditor";
import DurationSlider from "@/components/generate/DurationSlider";
import VideoStyleOptions from "./VideoStyleOptions";
import { type Database } from "@/integrations/supabase/types";
import { videoStyles } from "@/components/generate/GenerateForm";

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

interface AdvancedSettingsPanelProps {
  duration: number;
  setDuration: (duration: number) => void;
  style: string;
  setStyle: (style: string) => void;
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
}

const AdvancedSettingsPanel: React.FC<AdvancedSettingsPanelProps> = ({
  duration,
  setDuration,
  style,
  setStyle,
  scenes,
  setScenes,
}) => {
  return (
    <Card className="p-4 sm:p-6 bg-white/5 border-white/10 space-y-4 md:space-y-6 animate-fadeIn">
      <SceneEditor scenes={scenes} setScenes={setScenes} />
      <DurationSlider duration={duration} onDurationChange={setDuration} />
      <VideoStyleOptions
        videoStyles={videoStyles}
        selectedStyle={style}
        onStyleSelect={setStyle}
      />
    </Card>
  );
};

export default AdvancedSettingsPanel;
