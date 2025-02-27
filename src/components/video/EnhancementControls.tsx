
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sparkles } from 'lucide-react';
import { Label } from "@/components/ui/label";
import type { Enhancement } from '@/hooks/use-video-enhancements';
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
  onSubmit
}: EnhancementControlsProps) => {
  if (!selectedEnhancement) return null;

  return (
    <div className="space-y-4">
      {selectedEnhancement.id === 'filter' && (
        <div>
          <Label htmlFor="filter-style" className="block text-sm font-medium mb-2">
            Select Filter Style
          </Label>
          <Select
            value={selectedFilter}
            onValueChange={(value: FilterType) => setSelectedFilter(value)}
          >
            <SelectTrigger id="filter-style" name="filter-style" className="w-full max-w-xs">
              <SelectValue placeholder="Choose a filter style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cinematic">Cinematic</SelectItem>
              <SelectItem value="vintage">Vintage</SelectItem>
              <SelectItem value="anime">Anime</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedEnhancement.id === 'speed_adjustment' && (
        <div>
          <Label htmlFor="speed-factor" className="block text-sm font-medium mb-2">
            Speed Factor
          </Label>
          <Select
            value={speedFactor.toString()}
            onValueChange={(value) => setSpeedFactor(parseFloat(value))}
          >
            <SelectTrigger id="speed-factor" name="speed-factor" className="w-full max-w-xs">
              <SelectValue placeholder="Select speed factor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x (Slow Motion)</SelectItem>
              <SelectItem value="1">1x (Normal)</SelectItem>
              <SelectItem value="1.5">1.5x (Fast)</SelectItem>
              <SelectItem value="2">2x (Very Fast)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full md:w-auto bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple text-white shadow-neon"
        id="enhance-video-button"
        name="enhance-video-button"
        aria-label="Enhance selected video"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner className="mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2" />
            Enhance Video
          </>
        )}
      </Button>
    </div>
  );
};
