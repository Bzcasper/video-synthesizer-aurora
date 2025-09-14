import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import VideoDescriptionInput from "./VideoDescriptionInput";
import FormHeader from "./form/FormHeader";
import FormActions from "./form/FormActions";
import GenerationProgress from "./form/GenerationProgress";
import AdvancedSettingsPanel from "./form/AdvancedSettingsPanel";
import { useVideoGeneration } from "@/hooks/video/use-video-generation";
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

const EnhancedGenerateForm = () => {
  // Video generation state
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState("cinematic");
  const [scenes, setScenes] = useState<Scene[]>([]);

  // UI state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Form validation
  const isFormValid = prompt.trim().length > 0;

  // Use custom hook for video generation logic
  const {
    generateVideo,
    isGenerating,
    generationProgress,
    timeRemaining,
    currentStage,
  } = useVideoGeneration();

  // Toggle advanced settings
  const toggleAdvancedSettings = useCallback(() => {
    setShowAdvancedSettings((prev) => !prev);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isGenerating) return;

    await generateVideo({
      prompt,
      duration,
      style,
      scenes,
    });
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      aria-label="Video generation form"
    >
      <FormHeader
        title="Create a New Video"
        subtitle="Describe your video and customize settings to bring your vision to life"
      />

      <AnimatePresence>
        <GenerationProgress
          showProgress={isGenerating}
          progressPercentage={generationProgress}
          timeRemaining={timeRemaining}
          currentStage={currentStage}
        />
      </AnimatePresence>

      <VideoDescriptionInput
        value={prompt}
        onChange={setPrompt}
        disabled={isGenerating}
      />

      <FormActions
        isGenerating={isGenerating}
        isFormValid={isFormValid}
        onAdvancedToggle={toggleAdvancedSettings}
      />

      <AnimatePresence>
        {showAdvancedSettings && (
          <AdvancedSettingsPanel
            duration={duration}
            setDuration={setDuration}
            style={style}
            setStyle={setStyle}
            scenes={scenes}
            setScenes={setScenes}
          />
        )}
      </AnimatePresence>
    </form>
  );
};

export default EnhancedGenerateForm;
