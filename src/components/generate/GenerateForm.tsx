
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Video, Loader2, Sparkles } from "lucide-react";
import VideoStyleOption from './VideoStyleOption';
import DurationSlider from './DurationSlider';
import { Card } from "@/components/ui/card";

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
}: GenerateFormProps) => {
  return (
    <Card className="p-fib-4 glass-panel hover-glow">
      <form className="space-y-fib-3" onSubmit={onSubmit}>
        <div className="space-y-fib-2">
          <label className="text-fib-base font-medium text-gray-200 flex items-center gap-2">
            <Sparkles className="w-fib-3 h-fib-3 text-aurora-blue" />
            Video Description
          </label>
          <Textarea
            placeholder="Describe your video in detail. For example: A serene mountain landscape at sunset, with clouds moving in timelapse..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-[144px] bg-white/5 border-white/10 text-white focus:ring-aurora-blue 
                     hover:border-aurora-blue/50 transition-golden"
          />
          <p className="text-fib-sm text-gray-400">
            Be specific about what you want to see in your video. Include details about mood, lighting, and movement.
          </p>
        </div>

        <DurationSlider 
          duration={duration}
          onDurationChange={setDuration}
        />

        <div className="space-y-fib-2">
          <label className="text-fib-base font-medium text-gray-200">Video Style</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-3">
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

        <Button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full h-fib-5 text-fib-base bg-aurora-blue hover:bg-aurora-blue/90 text-white 
                   shadow-[0_0_20px_rgba(0,166,255,0.3)] hover:shadow-[0_0_30px_rgba(0,166,255,0.5)]
                   transition-golden duration-golden font-semibold"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-fib-3 w-fib-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Video className="mr-2 h-fib-3 w-fib-3" />
              Generate Video
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default GenerateForm;
