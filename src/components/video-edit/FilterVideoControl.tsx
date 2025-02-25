
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type VideoFilterType = Database["public"]["Enums"]["video_filter_type"];

interface FilterVideoControlProps {
  onApplyFilter: (filter: VideoFilterType) => Promise<void>;
  isProcessing?: boolean;
}

const FilterVideoControl = ({ onApplyFilter, isProcessing = false }: FilterVideoControlProps) => {
  const [selectedFilter, setSelectedFilter] = useState<VideoFilterType>("none");

  const handleApplyFilter = async () => {
    if (selectedFilter !== "none") {
      await onApplyFilter(selectedFilter);
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-black/30 border-white/10">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Palette className="w-5 h-5 text-aurora-blue" />
        Apply Filter
      </h3>

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
    </Card>
  );
};

export default FilterVideoControl;
