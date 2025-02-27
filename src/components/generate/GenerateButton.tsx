
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Video } from "lucide-react";

interface GenerateButtonProps {
  isGenerating: boolean;
  disabled: boolean;
  onClick?: () => void;
}

const GenerateButton = ({ isGenerating, disabled, onClick }: GenerateButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isGenerating || disabled}
      onClick={onClick}
      aria-label={isGenerating ? "Generating video..." : "Generate video"}
      className="w-full h-16 text-lg bg-aurora-blue hover:bg-aurora-blue/90 text-white 
                shadow-[0_0_30px_rgba(0,166,255,0.3)] hover:shadow-[0_0_40px_rgba(0,166,255,0.5)]
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
  );
};

export default GenerateButton;
