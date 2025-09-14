import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useVideoEnhancements } from "@/hooks/use-video-enhancements";
import { VideoSelectionGrid } from "./selection/VideoSelectionGrid";
import { EnhancementOptionsGrid } from "./enhancement/EnhancementOptionsGrid";
import { EnhancementProgressCard } from "./enhancement/EnhancementProgressCard";
import { EnhancementControls } from "./EnhancementControls";
import { enhancements } from "./enhancement-options";
import CustomIcon from "@/components/ui/custom-icon";

export const VideoEnhancementSelector = () => {
  const {
    selectedVideo,
    setSelectedVideo,
    selectedEnhancement,
    setSelectedEnhancement,
    selectedFilter,
    setSelectedFilter,
    speedFactor,
    setSpeedFactor,
    isSubmitting,
    enhancementProgress,
    videos,
    isLoading,
    handleSubmitEnhancement,
  } = useVideoEnhancements();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
        <LoadingSpinner className="w-12 h-12 text-aurora-blue" />
        <p className="mt-4 text-gray-400">Loading your videos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow flex items-center">
          <CustomIcon
            name="enhance"
            className="mr-3 h-6 w-6 text-aurora-blue"
          />
          Select Video to Enhance
        </h2>
        <VideoSelectionGrid
          videos={videos || []}
          selectedVideo={selectedVideo}
          onSelectVideo={setSelectedVideo}
        />
      </div>

      {selectedVideo && (
        <div className="space-y-6">
          <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow flex items-center">
            <CustomIcon
              name="advanced"
              className="mr-3 h-6 w-6 text-aurora-purple"
            />
            Choose Enhancement
          </h2>
          <EnhancementOptionsGrid
            enhancements={enhancements}
            selectedEnhancement={selectedEnhancement}
            onSelectEnhancement={setSelectedEnhancement}
          />

          {Object.values(enhancementProgress).map((progress) => (
            <EnhancementProgressCard key={progress.id} progress={progress} />
          ))}

          <EnhancementControls
            selectedEnhancement={selectedEnhancement}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            speedFactor={speedFactor}
            setSpeedFactor={setSpeedFactor}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitEnhancement}
          />
        </div>
      )}
    </div>
  );
};
