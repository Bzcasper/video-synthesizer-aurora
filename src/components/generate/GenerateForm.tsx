import React, { useCallback, useState, useEffect } from 'react';
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VideoDescriptionInput from './VideoDescriptionInput';
import GenerateButton from './GenerateButton';
import ActionButtons from './ActionButtons';
import { Card } from "@/components/ui/card";
import { SceneEditor } from './SceneEditor';
import DurationSlider from './DurationSlider';
import VideoStyleOption from './VideoStyleOption';
import { Scene, VideoGenerationFormValues, videoGenerationSchema } from './scene/types';
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

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
  const handleSubmitWithValidation: SubmitHandler<VideoGenerationFormValues> = (data) => {
    // Pass event to parent onSubmit
    onSubmit(new Event('submit') as unknown as React.FormEvent);
  };
  
  // Toggle advanced settings visibility
  const toggleAdvancedSettings = useCallback(() => {
    setShowAdvancedSettings(prev => !prev);
  }, []);

  // Check if form is valid
  const isFormValid = methods.formState.isValid && prompt.trim().length > 0;

  return (
    <FormProvider {...methods}>
      <form 
        className="space-y-6" 
        onSubmit={methods.handleSubmit(handleSubmitWithValidation)}
        aria-label="Video generation form"
      >
        {/* Main Form Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VideoDescriptionInput 
              value={prompt} 
              onChange={(val) => {
                setPrompt(val);
                methods.setValue('prompt', val, { shouldValidate: true });
              }}
              disabled={isGenerating} 
            />
          </motion.div>

          {/* Main Generate Button */}
          <GenerateButton 
            isGenerating={isGenerating} 
            disabled={!isFormValid || methods.formState.isSubmitting} 
          />

          {/* Secondary Action Buttons */}
          <ActionButtons 
            disabled={isGenerating}
            onDetailsClick={toggleAdvancedSettings}
            showingDetails={showAdvancedSettings}
            onEnhanceClick={() => {
              // Keep this for future enhancement functionality
              toast({
                title: "AI Enhancement",
                description: "AI is analyzing your prompt to suggest improvements.",
              });
            }}
          />
        </div>

        {/* Advanced Settings (conditionally displayed) */}
        <AnimatePresence>
          {showAdvancedSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-white/5 border-white/10 space-y-6 overflow-hidden">
                {/* Style Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Video Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videoStyles.map((styleOption) => (
                      <VideoStyleOption
                        key={styleOption.id}
                        {...styleOption}
                        isSelected={style === styleOption.id}
                        onSelect={(id) => {
                          setStyle(id);
                          methods.setValue('style', id, { shouldValidate: true });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Duration Slider */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Video Duration</h3>
                  <DurationSlider 
                    duration={duration} 
                    onDurationChange={(val) => {
                      setDuration(val);
                      methods.setValue('duration', val, { shouldValidate: true });
                    }} 
                  />
                </div>

                {/* Scene Editor */}
                <SceneEditor 
                  scenes={scenes} 
                  setScenes={(newScenes) => {
                    setScenes(newScenes);
                    methods.setValue('scenes', newScenes, { shouldValidate: true });
                  }} 
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </FormProvider>
  );
};

export default GenerateForm;
