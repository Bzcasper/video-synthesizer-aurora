
import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SceneEditor } from '@/components/generate/SceneEditor';
import DurationSlider from '@/components/generate/DurationSlider';
import VideoStyleOptions from './VideoStyleOptions';
import { videoStyles } from '@/components/generate/GenerateForm';
import { Scene } from '../scene/types';

interface AdvancedSettingsProps {
  duration: number;
  setDuration: (duration: number) => void;
  style: string;
  setStyle: (style: string) => void;
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  duration,
  setDuration,
  style,
  setStyle,
  scenes,
  setScenes,
}) => {
  return (
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
          <VideoStyleOptions 
            videoStyles={videoStyles}
            selectedStyle={style}
            onStyleSelect={setStyle}
          />
        </div>

        {/* Duration Slider */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Video Duration</h3>
          <DurationSlider 
            duration={duration} 
            onDurationChange={setDuration} 
          />
        </div>

        {/* Scene Editor */}
        <SceneEditor 
          scenes={scenes} 
          setScenes={setScenes} 
        />
      </Card>
    </motion.div>
  );
};

export default AdvancedSettings;
