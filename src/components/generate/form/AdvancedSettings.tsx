import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SceneEditor } from "@/components/generate/SceneEditor";
import DurationSlider from "@/components/generate/DurationSlider";
import VideoStyleOptions from "./VideoStyleOptions";
import { videoStyles } from "@/components/generate/GenerateForm";
import { Scene } from "../scene/types";
import { Separator } from "@/components/ui/separator";
import { CustomIcon } from "@/components/ui/icons";

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
      <Card className="p-6 bg-white/5 border-white/10 space-y-8 overflow-hidden">
        {/* Style Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CustomIcon name="template" className="h-5 w-5 text-aurora-blue" />
            <h3 className="text-lg font-medium">Video Style</h3>
          </div>
          <VideoStyleOptions
            videoStyles={videoStyles}
            selectedStyle={style}
            onStyleSelect={setStyle}
          />
        </div>

        <Separator className="bg-white/10" />

        {/* Duration Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CustomIcon name="clock" className="h-5 w-5 text-aurora-blue" />
            <h3 className="text-lg font-medium">Video Duration</h3>
          </div>
          <DurationSlider duration={duration} onDurationChange={setDuration} />
        </div>

        <Separator className="bg-white/10" />

        {/* Scene Editor */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CustomIcon name="videos" className="h-5 w-5 text-aurora-blue" />
            <h3 className="text-lg font-medium">Scene Customization</h3>
          </div>
          <SceneEditor scenes={scenes} setScenes={setScenes} />
        </div>
      </Card>
    </motion.div>
  );
};

export default AdvancedSettings;
