
import { useState } from 'react';
import type { Enhancement, FilterType } from './types';

/**
 * Hook to manage enhancement selection state
 * 
 * @returns Selected enhancement state and related functions
 */
export function useEnhancementSelection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedEnhancement, setSelectedEnhancement] = useState<Enhancement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");
  const [speedFactor, setSpeedFactor] = useState<number>(1);

  return {
    selectedVideo,
    setSelectedVideo,
    selectedEnhancement,
    setSelectedEnhancement,
    selectedFilter,
    setSelectedFilter,
    speedFactor,
    setSpeedFactor
  };
}
