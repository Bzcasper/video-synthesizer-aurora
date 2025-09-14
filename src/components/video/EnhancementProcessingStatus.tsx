import React from "react";
import { useVideoEnhancements } from "@/hooks/use-video-enhancements";
import { EnhancementProcessingPanel } from "./enhancement/EnhancementProcessingPanel";

export const EnhancementProcessingStatus: React.FC = () => {
  // Only use the enhancementProgress part of the hook
  const { enhancementProgress } = useVideoEnhancements();

  return (
    <div className="space-y-4">
      <EnhancementProcessingPanel />
    </div>
  );
};
