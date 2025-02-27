
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileVideo, Wand2 } from "lucide-react";

interface ActionButtonsProps {
  onDetailsClick?: () => void;
  onEnhanceClick?: () => void;
  disabled?: boolean;
}

const ActionButtons = ({ onDetailsClick, onEnhanceClick, disabled = false }: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={onDetailsClick}
        aria-label="Video Details"
        className="h-12 text-sm hover:bg-aurora-purple/10"
      >
        <FileVideo className="mr-2 h-5 w-5" aria-hidden="true" />
        <span>Video Details</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={onEnhanceClick}
        aria-label="Enhance Video"
        className="h-12 text-sm hover:bg-aurora-blue/10"
      >
        <Wand2 className="mr-2 h-5 w-5" aria-hidden="true" />
        <span>Enhance Video</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
