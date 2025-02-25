
import { Video, Film, Sparkles, Clock, Text, Mic } from 'lucide-react';
import type { Enhancement } from '@/hooks/use-video-enhancements';

export const enhancements: Enhancement[] = [
  {
    id: "upscale",
    label: "Super Resolution",
    description: "Upscale your video to 4K with AI-enhanced details",
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    id: "frame_interpolation",
    label: "Frame Interpolation",
    description: "Create smooth slow-motion with AI frame generation",
    icon: <Film className="w-8 h-8" />,
  },
  {
    id: "filter",
    label: "Style Filters",
    description: "Apply cinematic and artistic filters",
    icon: <Video className="w-8 h-8" />,
  },
  {
    id: "speed_adjustment",
    label: "Speed Control",
    description: "Create slow-motion or timelapse effects",
    icon: <Clock className="w-8 h-8" />,
  },
  {
    id: "subtitle_overlay",
    label: "Subtitles",
    description: "Add AI-generated or custom subtitles",
    icon: <Text className="w-8 h-8" />,
  },
  {
    id: "lip_sync",
    label: "Lip Sync",
    description: "Synchronize speech with animated characters",
    icon: <Mic className="w-8 h-8" />,
    comingSoon: true,
  },
];
