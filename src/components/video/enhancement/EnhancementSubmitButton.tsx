
import React from 'react';
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sparkles } from 'lucide-react';

interface EnhancementSubmitButtonProps {
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const EnhancementSubmitButton: React.FC<EnhancementSubmitButtonProps> = ({
  isSubmitting,
  onSubmit
}) => {
  return (
    <Button
      onClick={onSubmit}
      disabled={isSubmitting}
      className="w-full md:w-auto bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple text-white shadow-neon"
      id="enhance-video-button"
      name="enhance-video-button"
      aria-label="Enhance selected video"
      aria-busy={isSubmitting}
      type="button"
    >
      {isSubmitting ? (
        <>
          <LoadingSpinner className="mr-2" aria-hidden="true" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Sparkles className="mr-2" aria-hidden="true" />
          <span>Enhance Video</span>
        </>
      )}
    </Button>
  );
};
