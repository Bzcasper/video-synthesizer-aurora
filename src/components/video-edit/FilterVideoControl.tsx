
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WandIcon } from "lucide-react";

interface FilterVideoControlProps {
  currentFilter: string;
  onChange: (filter: string) => void;
  isProcessing?: boolean;
}

const filterOptions = [
  { id: 'none', label: 'No Filter' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'anime', label: 'Anime Style' },
  { id: 'noir', label: 'Film Noir' },
];

const FilterVideoControl = ({
  currentFilter,
  onChange,
  isProcessing = false,
}: FilterVideoControlProps) => {
  return (
    <div className="space-y-4">
      <Select
        value={currentFilter}
        onValueChange={onChange}
        disabled={isProcessing}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((filter) => (
            <SelectItem key={filter.id} value={filter.id}>
              {filter.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={() => onChange(currentFilter)}
        disabled={isProcessing || currentFilter === 'none'}
        className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            <WandIcon className="w-4 h-4 mr-2" />
            Apply Filter
          </>
        )}
      </Button>
    </div>
  );
};

export default FilterVideoControl;
