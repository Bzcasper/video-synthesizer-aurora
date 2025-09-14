import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { TimeRemaining } from "@/components/video/common/TimeRemaining";
import { Loader2 } from "lucide-react";

interface GenerationProgressProps {
  showProgress: boolean;
  progressPercentage: number;
  timeRemaining: number;
  currentStage: string;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  showProgress,
  progressPercentage,
  timeRemaining,
  currentStage,
}) => {
  if (!showProgress) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-black/30 rounded-lg p-4 mb-6 border border-white/10"
    >
      <div className="flex items-center mb-2">
        <Loader2 className="h-5 w-5 mr-2 text-aurora-blue animate-spin" />
        <h3 className="font-medium">Generating Video</h3>
      </div>
      <p className="text-sm text-gray-400 mb-3">{currentStage}</p>
      <Progress value={progressPercentage} className="h-2 mb-2" />
      <TimeRemaining timeRemaining={timeRemaining} />
    </motion.div>
  );
};

export default GenerationProgress;
