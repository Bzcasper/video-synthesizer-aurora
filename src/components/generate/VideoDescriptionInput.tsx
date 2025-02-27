
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface VideoDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const VideoDescriptionInput = ({ value, onChange, disabled = false }: VideoDescriptionInputProps) => {
  const maxLength = 500; // Maximum character limit
  const isNearLimit = value.length > maxLength * 0.8;
  const isAtLimit = value.length >= maxLength;
  const charPercentage = (value.length / maxLength) * 100;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 w-full"
    >
      <Label 
        htmlFor="video-description" 
        className="text-base font-medium text-gray-200 flex items-center gap-2"
      >
        <Sparkles className="w-5 h-5 text-aurora-blue animate-pulse" />
        Video Description
      </Label>
      
      <div className="relative">
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
                      isAtLimit ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
                      isNearLimit ? 'border-yellow-500' : ''
                    }`}
        />
        
        <div className="absolute bottom-2 right-2">
          <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            <span className={`${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-400'}`}>
              {value.length}/{maxLength}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p id="description-hint" className="text-sm text-gray-400 max-w-[80%]">
          Be specific about what you want to see in your video. Include details about mood, lighting, and movement.
        </p>
        
        <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${
              isAtLimit ? 'bg-red-500' : 
              isNearLimit ? 'bg-yellow-500' : 'bg-aurora-blue'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: `${charPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default VideoDescriptionInput;
