
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Palette, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VideoFilterType = "none" | "cinematic" | "vintage" | "anime";

interface FilterVideoControlProps {
  videoId: string;
  onSubmit: (params: { filter: VideoFilterType }) => void;
  isProcessing?: boolean;
}

const FilterVideoControl = ({ videoId, onSubmit, isProcessing = false }: FilterVideoControlProps) => {
  const [selectedFilter, setSelectedFilter] = useState<VideoFilterType>("none");

  const handleApplyFilter = () => {
    if (selectedFilter !== "none") {
      onSubmit({ filter: selectedFilter });
    }
  };

  return (
    <div className="space-y-4">
      <Select
        value={selectedFilter}
        onValueChange={(value) => setSelectedFilter(value as VideoFilterType)}
      >
        <SelectTrigger className="w-full bg-black/50 border-white/10">
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cinematic">Cinematic</SelectItem>
          <SelectItem value="vintage">Vintage</SelectItem>
          <SelectItem value="anime">Anime</SelectItem>
          <SelectItem value="none">None</SelectItem>
        </SelectContent>
      </Select>

      <Button
        className="w-full bg-aurora-blue hover:bg-aurora-blue/80 text-white"
        onClick={handleApplyFilter}
        disabled={isProcessing || selectedFilter === "none"}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Applying...
          </>
        ) : (
          "Apply Filter"
        )}
      </Button>
    </div>
  );
};

export default FilterVideoControl;
