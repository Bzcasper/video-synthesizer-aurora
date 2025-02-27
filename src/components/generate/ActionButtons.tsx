
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileVideo, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

interface ActionButtonsProps {
  onDetailsClick?: () => void;
  onEnhanceClick?: () => void;
  disabled?: boolean;
}

const ActionButtons = ({ onDetailsClick, onEnhanceClick, disabled = false }: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={onDetailsClick}
          aria-label="Video Details"
          className="w-full h-12 text-sm border-aurora-purple/30 text-aurora-white
                   hover:bg-aurora-purple/10 hover:border-aurora-purple
                   hover:text-aurora-purple transition-all duration-300"
        >
          <FileVideo className="mr-2 h-5 w-5" aria-hidden="true" />
          <span>Video Details</span>
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={onEnhanceClick}
          aria-label="Enhance Video"
          className="w-full h-12 text-sm border-aurora-blue/30 text-aurora-white
                   hover:bg-aurora-blue/10 hover:border-aurora-blue
                   hover:text-aurora-blue transition-all duration-300"
        >
          <Wand2 className="mr-2 h-5 w-5" aria-hidden="true" />
          <span>Enhance Video</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default ActionButtons;
