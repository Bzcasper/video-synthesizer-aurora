import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  status?: "processing" | "completed" | "failed" | "pending" | "queued";
  className?: string;
  showAnimation?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status = "processing",
  className = "",
  showAnimation = true,
}) => {
  return (
    <div
      className={`relative h-2 bg-black/30 rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        className={`absolute top-0 left-0 h-full ${
          status === "failed"
            ? "bg-gradient-to-r from-red-600 to-red-400"
            : "bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green"
        }`}
        initial={showAnimation ? { width: 0 } : undefined}
        animate={showAnimation ? { width: `${progress}%` } : undefined}
        style={!showAnimation ? { width: `${progress}%` } : undefined}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};
