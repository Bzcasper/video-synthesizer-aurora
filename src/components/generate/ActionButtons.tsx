/** @format */

import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

interface ActionButtonsProps {
  disabled: boolean;
  onDetailsClick: () => void;
  onEnhanceClick?: () => void;
  showingDetails?: boolean;
}

const ActionButtons = ({
  disabled,
  onDetailsClick,
  onEnhanceClick,
  showingDetails = false,
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1"
      >
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={onDetailsClick}
          className="w-full"
          aria-expanded={showingDetails}
          aria-controls="advanced-settings"
        >
          <Settings className="mr-2 h-5 w-5" aria-hidden="true" />
          <span>
            {showingDetails
              ? "Hide Advanced Settings"
              : "Show Advanced Settings"}
          </span>
          {showingDetails ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1"
      >
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || !onEnhanceClick}
          onClick={() => onEnhanceClick?.()}
          className="w-full"
        >
          <Sparkles
            className="mr-2 h-5 w-5 text-yellow-300"
            aria-hidden="true"
          />
          <span>Enhance with AI</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default ActionButtons;
