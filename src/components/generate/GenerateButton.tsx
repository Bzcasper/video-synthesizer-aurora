
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Video } from "lucide-react";
import { motion } from "framer-motion";

interface GenerateButtonProps {
  isGenerating: boolean;
  disabled: boolean;
  onClick?: () => void;
}

const GenerateButton = ({ isGenerating, disabled, onClick }: GenerateButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button
        type="submit"
        disabled={isGenerating || disabled}
        onClick={onClick}
        aria-label={isGenerating ? "Generating video..." : "Generate video"}
        className="w-full h-16 text-lg bg-gradient-to-r from-aurora-blue to-aurora-purple 
                text-white shadow-[0_0_30px_rgba(0,166,255,0.3)] 
                hover:shadow-[0_0_40px_rgba(0,166,255,0.5)]
                hover:from-aurora-purple hover:to-aurora-blue
                transition-golden duration-golden font-semibold"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" aria-hidden="true" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Video className="mr-2 h-6 w-6" aria-hidden="true" />
            <span>Generate Video</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default GenerateButton;
