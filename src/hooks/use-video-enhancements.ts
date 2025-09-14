import { useEnhancementSelection } from "./video/use-enhancement-selection";
import { useFetchVideos } from "./video/use-fetch-videos";
import { useEnhancementProgress } from "./video/use-enhancement-progress";
import { useSubmitEnhancement } from "./video/use-submit-enhancement";

// Re-export types from the types file
export type { Video, Enhancement, EnhancementProgress } from "./video/types";

/**
 * Main hook combining all video enhancement functionality
 * This hook orchestrates the different specialized hooks to provide a unified API
 *
 * @returns Combined state and functions for video enhancement workflows
 */
export const useVideoEnhancements = () => {
  // Use specialized hooks
  const {
    selectedVideo,
    setSelectedVideo,
    selectedEnhancement,
    setSelectedEnhancement,
    selectedFilter,
    setSelectedFilter,
    speedFactor,
    setSpeedFactor,
  } = useEnhancementSelection();

  const { data: videos, isLoading } = useFetchVideos();

  const { enhancementProgress, setEnhancementProgress } =
    useEnhancementProgress();

  const { isSubmitting, handleSubmitEnhancement } = useSubmitEnhancement(
    setEnhancementProgress,
  );

  // Wrapper function for handleSubmitEnhancement to maintain the same API
  const submitEnhancement = async () => {
    const result = await handleSubmitEnhancement(
      selectedVideo,
      selectedEnhancement,
      selectedFilter,
      speedFactor,
    );

    // Reset selectedEnhancement if submission was successful
    if (result) {
      setSelectedEnhancement(null);
    }
  };

  // Return combined API from all hooks
  return {
    // From useEnhancementSelection
    selectedVideo,
    setSelectedVideo,
    selectedEnhancement,
    setSelectedEnhancement,
    selectedFilter,
    setSelectedFilter,
    speedFactor,
    setSpeedFactor,

    // From useFetchVideos
    videos,
    isLoading,

    // From useEnhancementProgress
    enhancementProgress,
    setEnhancementProgress,

    // From useSubmitEnhancement
    isSubmitting,

    // Combined function
    handleSubmitEnhancement: submitEnhancement,
  };
};
