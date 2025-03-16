
import React from 'react';
import { motion } from "framer-motion";
import GenerateButton from '@/components/generate/GenerateButton';
import ActionButtons from '@/components/generate/ActionButtons';

interface FormActionsProps {
  isGenerating: boolean;
  isFormValid: boolean;
  onAdvancedToggle: () => void;
  showingDetails?: boolean;
  onEnhance?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isGenerating,
  isFormValid,
  onAdvancedToggle,
  showingDetails = false,
  onEnhance,
}) => {
  return (
    <div className="space-y-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full flex justify-center"
      >
        <GenerateButton 
          isGenerating={isGenerating} 
          disabled={!isFormValid} 
        />
      </motion.div>
      
      <div className="flex justify-center">
        <ActionButtons 
          disabled={isGenerating}
          onDetailsClick={onAdvancedToggle}
          showingDetails={showingDetails}
          onEnhanceClick={onEnhance}
        />
      </div>
    </div>
  );
};

export default FormActions;
