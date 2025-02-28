
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onMoveUp}
              disabled={index === 0}
              aria-label={`Move scene ${index + 1} up`}
              className="text-white/60 hover:text-white disabled:text-white/20"
            >
              <ArrowUpCircle className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Move scene earlier in sequence</p>
          </TooltipContent>
        </Tooltip>
      
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onMoveDown}
              disabled={index === totalScenes - 1}
              aria-label={`Move scene ${index + 1} down`}
              className="text-white/60 hover:text-white disabled:text-white/20"
            >
              <ArrowDownCircle className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Move scene later in sequence</p>
          </TooltipContent>
        </Tooltip>
      
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRemove}
              aria-label={`Remove scene ${index + 1}`}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <MinusCircle className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Remove this scene</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
