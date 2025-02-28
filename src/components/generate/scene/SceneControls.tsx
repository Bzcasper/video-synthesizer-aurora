
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';

interface SceneControlsProps {
  index: number;
  totalScenes: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export const SceneControls: React.FC<SceneControlsProps> = ({
  index,
  totalScenes,
  onMoveUp,
  onMoveDown,
  onRemove
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onMoveUp}
        disabled={index === 0}
        aria-label={`Move scene ${index + 1} up`}
      >
        <ArrowUpCircle className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onMoveDown}
        disabled={index === totalScenes - 1}
        aria-label={`Move scene ${index + 1} down`}
      >
        <ArrowDownCircle className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onRemove}
        aria-label={`Remove scene ${index + 1}`}
      >
        <MinusCircle className="w-4 h-4" />
      </Button>
    </div>
  );
};
