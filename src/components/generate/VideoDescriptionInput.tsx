
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface VideoDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const VideoDescriptionInput = ({ value, onChange, disabled = false }: VideoDescriptionInputProps) => {
  const maxLength = 500; // Maximum character limit
  const isNearLimit = value.length > maxLength * 0.8;
  const isAtLimit = value.length >= maxLength;
  
  return (
    <div className="space-y-3 w-full">
      <Label htmlFor="video-description" className="text-base font-medium text-gray-200 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-aurora-blue" />
        Video Description
      </Label>
      <Textarea
        id="video-description"
        placeholder="Describe your video in detail. For example: A serene mountain landscape at sunset, with clouds moving in timelapse..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={maxLength}
        aria-describedby="description-hint"
        className={`h-[144px] w-full bg-white/5 border-white/10 text-white focus:ring-aurora-blue 
                   hover:border-aurora-blue/50 transition-golden ${
                     isAtLimit ? 'border-red-500' : isNearLimit ? 'border-yellow-500' : ''
                   }`}
      />
      <div className="flex justify-between">
        <p id="description-hint" className="text-sm text-gray-400">
          Be specific about what you want to see in your video. Include details about mood, lighting, and movement.
        </p>
        <p className={`text-sm ${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-400'}`}>
          {value.length}/{maxLength}
        </p>
      </div>
    </div>
  );
};

export default VideoDescriptionInput;
