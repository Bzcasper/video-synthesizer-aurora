import React from "react";
import { FilterControls } from "./enhancement/FilterControls";
import { SpeedControls } from "./enhancement/SpeedControls";
import { EnhancementSubmitButton } from "./enhancement/EnhancementSubmitButton";
import type { Enhancement } from "@/hooks/use-video-enhancements";
import type { Database } from "@/integrations/supabase/types";

type FilterType = Database["public"]["Enums"]["video_filter_type"];

interface EnhancementControlsProps {
  selectedEnhancement: Enhancement | null;
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  speedFactor: number;
  setSpeedFactor: (speed: number) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const EnhancementControls = ({
  selectedEnhancement,
  selectedFilter,
  setSelectedFilter,
  speedFactor,
  setSpeedFactor,
  isSubmitting,
  onSubmit,
}: EnhancementControlsProps) => {
  if (!selectedEnhancement) return null;

  return (
    <div className="space-y-4">
      {selectedEnhancement.id === "filter" && (
        <FilterControls
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      )}

      {selectedEnhancement.id === "speed_adjustment" && (
        <SpeedControls
          speedFactor={speedFactor}
          setSpeedFactor={setSpeedFactor}
        />
      )}

      <EnhancementSubmitButton
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </div>
  );
};
