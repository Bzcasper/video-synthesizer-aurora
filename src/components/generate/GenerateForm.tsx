/** @format */

import React, { useCallback, useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import VideoDescriptionInput from "./VideoDescriptionInput";
import {
  Scene,
  VideoGenerationFormValues,
  videoGenerationSchema,
} from "./scene/types";
import FormActions from "./form/FormActions";
import AdvancedSettings from "./form/AdvancedSettings";

export const videoStyles = [
  {
    id: "cinematic",
    label: "Cinematic",
    description: "Professional movie-like quality with dramatic shots",
  },
  {
    id: "anime",
    label: "Anime",
    description: "Japanese animation style with vibrant colors",
  },
  {
    id: "realistic",
    label: "Realistic",
    description: "True-to-life footage with natural lighting",
  },
  {
    id: "artistic",
    label: "Artistic",
    description: "Creative and experimental visual effects",
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
  // Advanced settings visibility
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Validation and form state
  const methods = useForm<VideoGenerationFormValues>({
    resolver: zodResolver(videoGenerationSchema),
    defaultValues: {
      prompt,
      style,
      duration,
      scenes,
    },
    mode: "onChange",
  });

  // Sync form with parent state
  useEffect(() => {
    methods.reset({
      prompt,
      style,
      duration,
      scenes,
    });
  }, [prompt, style, duration, scenes, methods]);

  // Update parent state when form values change
  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (value.prompt !== undefined) setPrompt(value.prompt);
      if (value.duration !== undefined) setDuration(value.duration);
      if (value.style !== undefined) setStyle(value.style);
      if (value.scenes !== undefined) setScenes(value.scenes as Scene[]);
    });
    return () => subscription.unsubscribe();
  }, [methods, setPrompt, setDuration, setStyle, setScenes]);

  // Form submission with validation
  const handleSubmitWithValidation: SubmitHandler<VideoGenerationFormValues> = (
    data
  ) => {
    // Pass event to parent onSubmit
    onSubmit(new Event("submit") as unknown as React.FormEvent);
  };

  // Toggle advanced settings visibility
  const toggleAdvancedSettings = useCallback(() => {
    setShowAdvancedSettings((prev) => !prev);
  }, []);

  // Check if form is valid
  const isFormValid = methods.formState.isValid && prompt.trim().length > 0;

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-4 md:space-y-6"
        onSubmit={methods.handleSubmit(handleSubmitWithValidation)}
        aria-label="Video generation form">
        <VideoDescriptionInput
          value={prompt}
          onChange={(val) => {
            setPrompt(val);
            methods.setValue("prompt", val, { shouldValidate: true });
          }}
          disabled={isGenerating}
        />

        <FormActions
          isGenerating={isGenerating}
          isFormValid={isFormValid}
          onAdvancedToggle={toggleAdvancedSettings}
          showingDetails={showAdvancedSettings}
          onEnhance={() => {
            toast({
              title: "AI Enhancement",
              description:
                "AI is analyzing your prompt to suggest improvements.",
            });
          }}
        />

        <AnimatePresence>
          {showAdvancedSettings && (
            <AdvancedSettings
              duration={duration}
              setDuration={(val) => {
                setDuration(val);
                methods.setValue("duration", val, { shouldValidate: true });
              }}
              style={style}
              setStyle={(id) => {
                setStyle(id);
                methods.setValue("style", id, { shouldValidate: true });
              }}
              scenes={scenes}
              setScenes={(newScenes) => {
                setScenes(newScenes);
                methods.setValue("scenes", newScenes, { shouldValidate: true });
              }}
            />
          )}
        </AnimatePresence>
      </form>
    </FormProvider>
  );
};

export default GenerateForm;
