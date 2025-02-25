
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Palette } from "lucide-react";

export interface FilterVideoControlProps {
  onFilterApply: (filter: string) => Promise<void>;
  isProcessing?: boolean;
}

const filters = [
  {
    id: 'vintage',
    label: 'Vintage',
    description: 'Warm, faded colors with film grain effect'
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Enhanced contrast and color grading'
  },
  {
    id: 'anime',
    label: 'Anime',
    description: 'Vibrant colors and enhanced edges'
  },
  {
    id: 'none',
    label: 'No Filter',
    description: 'Original video without effects'
  }
];

const FilterVideoControl: React.FC<FilterVideoControlProps> = ({
  onFilterApply,
  isProcessing = false
}) => {
  const [selectedFilter, setSelectedFilter] = useState('none');

  const handleApplyFilter = async () => {
    await onFilterApply(selectedFilter);
  };

  return (
    <Card className="glass-panel p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Palette className="h-5 w-5 text-aurora-blue" />
        <h3>Apply Filter</h3>
      </div>

      <RadioGroup
        value={selectedFilter}
        onValueChange={setSelectedFilter}
        className="grid gap-2"
      >
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-start space-x-2">
            <RadioGroupItem
              value={filter.id}
              id={filter.id}
              className="border-aurora-blue data-[state=checked]:bg-aurora-blue data-[state=checked]:text-white"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={filter.id}
                className="font-medium cursor-pointer"
              >
                {filter.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {filter.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={handleApplyFilter}
        disabled={isProcessing || selectedFilter === 'none'}
        className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                 hover:from-aurora-blue hover:to-aurora-purple transition-all
                 duration-300 font-semibold text-white shadow-neon"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Applying Filter...
          </>
        ) : (
          'Apply Filter'
        )}
      </Button>
    </Card>
  );
};

export default FilterVideoControl;
