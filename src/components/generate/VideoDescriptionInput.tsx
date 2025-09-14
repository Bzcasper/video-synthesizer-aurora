import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { videoGenerationSchema } from "./scene/types";

interface VideoDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const VideoDescriptionInput = ({
  value,
  onChange,
  disabled = false,
}: VideoDescriptionInputProps) => {
  const maxLength = 500; // Maximum character limit
  const minLength = 20; // Minimum required length
  const isNearLimit = value.length > maxLength * 0.8;
  const isAtLimit = value.length >= maxLength;
  const isTooShort = value.length > 0 && value.length < minLength;
  const charPercentage = (value.length / maxLength) * 100;

  // Example prompts for inspiration
  const examplePrompts = [
    "A serene mountain landscape at sunrise with mist rolling through the valley and birds soaring overhead",
    "A bustling futuristic city with flying cars and neon lights reflecting off sleek skyscrapers",
    "An underwater coral reef teeming with colorful fish, gentle waves, and dancing sea plants",
    "A cozy cabin in a snowy forest with smoke rising from the chimney as snowflakes gently fall",
  ];

  const [currentExample, setCurrentExample] = useState(0);
  const [showExamples, setShowExamples] = useState(false);

  // Rotate through examples
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examplePrompts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [examplePrompts.length]);

  // Validate with Zod
  const validateDescription = (text: string) => {
    const result = videoGenerationSchema.shape.prompt.safeParse(text);
    return { isValid: result.success, error: !result.success };
  };

  const validation = validateDescription(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 w-full"
    >
      <div className="flex items-center justify-between">
        <Label
          htmlFor="video-description"
          className="text-base font-medium text-gray-200 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-aurora-blue animate-pulse" />
          Video Description
        </Label>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setShowExamples(!showExamples)}
                className="text-xs text-aurora-blue hover:text-aurora-blue/80 transition-colors"
              >
                Need ideas?
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="end" className="max-w-xs p-4">
              <p className="font-medium mb-2">Example: </p>
              <p className="text-sm italic">{examplePrompts[currentExample]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

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
                      isAtLimit
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : isTooShort
                          ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500"
                          : validation.error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : isNearLimit
                              ? "border-yellow-500"
                              : ""
                    }`}
        />

        <div className="absolute bottom-2 right-2">
          <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            <span
              className={`${isAtLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : "text-gray-400"}`}
            >
              {value.length}/{maxLength}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-start gap-2 max-w-[80%]">
          {isTooShort && (
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          )}
          <p
            id="description-hint"
            className={`text-sm ${isTooShort ? "text-yellow-500" : "text-gray-400"}`}
          >
            {isTooShort
              ? `Please add more details (at least ${minLength} characters).`
              : "Be specific about what you want to see in your video. Include details about mood, lighting, and movement."}
          </p>
        </div>

        <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              isAtLimit
                ? "bg-red-500"
                : isTooShort
                  ? "bg-yellow-500"
                  : "bg-aurora-blue"
            }`}
            initial={{ width: "0%" }}
            animate={{ width: `${charPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Examples Panel (Optional) */}
      <AnimatePresence>
        {showExamples && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-black/20 border border-white/10 rounded-lg p-4"
          >
            <h4 className="text-sm font-medium mb-2">Example Prompts:</h4>
            <ul className="space-y-2">
              {examplePrompts.map((example, index) => (
                <li key={index} className="text-sm text-gray-300">
                  <button
                    type="button"
                    onClick={() => onChange(example)}
                    className="text-left hover:text-aurora-blue transition-colors w-full"
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoDescriptionInput;
