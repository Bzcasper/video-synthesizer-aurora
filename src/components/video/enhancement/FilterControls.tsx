
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Database } from "@/integrations/supabase/types";

type FilterType = Database["public"]["Enums"]["video_filter_type"];

interface FilterControlsProps {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedFilter,
  setSelectedFilter
}) => {
  return (
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
  );
};
