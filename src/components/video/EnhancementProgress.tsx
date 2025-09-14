import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { EnhancementProgress as EnhancementProgressType } from "@/hooks/use-video-enhancements";
import { CustomIcon } from "@/components/ui/icons";

interface EnhancementProgressProps {
  progress: EnhancementProgressType;
}

export const EnhancementProgressBar = ({
  progress,
}: EnhancementProgressProps) => {
  const isActive =
    progress.status === "processing" || progress.status === "pending";

  // Map status to visual elements
  const statusMap = {
    processing: {
      color: "bg-aurora-blue",
      animation: "animate-pulse",
      icon: "processing",
      label: "Processing",
    },
    completed: {
      color: "bg-aurora-green",
      animation: "",
      icon: "play",
      label: "Enhancement Complete",
    },
    failed: {
      color: "bg-red-500",
      animation: "",
      icon: "help",
      label: "Enhancement Failed",
    },
    pending: {
      color: "bg-aurora-purple",
      animation: "",
      icon: "clock",
      label: "Queued",
    },
  };

  const statusData = statusMap[progress.status] || statusMap.pending;

  return (
    <Card className="glass-panel p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${statusData.color} ${statusData.animation}`}
          >
            <CustomIcon name={statusData.icon} className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-aurora-white">{statusData.label}</p>
            {progress.estimated_completion_time && isActive && (
              <p className="text-xs text-gray-400">
                Estimated completion: {progress.estimated_completion_time}
              </p>
            )}
          </div>
        </div>
        <span className="text-sm font-medium text-aurora-blue bg-aurora-blue/10 rounded-full px-2 py-1">
          {progress.progress}%
        </span>
      </div>

      <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
        <motion.div
          className={`absolute top-0 left-0 h-full ${
            progress.status === "failed"
              ? "bg-gradient-to-r from-red-600 to-red-400"
              : "bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress.progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </Card>
  );
};
