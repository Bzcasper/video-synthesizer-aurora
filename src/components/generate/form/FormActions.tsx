
import React from 'react';
import GenerateButton from '@/components/generate/GenerateButton';
import ActionButtons from '@/components/generate/ActionButtons';

interface FormActionsProps {
  isGenerating: boolean;
  isFormValid: boolean;
  onAdvancedToggle: () => void;
  onEnhance?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isGenerating,
  isFormValid,
  onAdvancedToggle,
  onEnhance,
}) => {
  return (
    <div className="space-y-4">
      <GenerateButton 
        isGenerating={isGenerating} 
        disabled={!isFormValid} 
      />
      <ActionButtons 
        disabled={isGenerating}
        onDetailsClick={onAdvancedToggle}
        onEnhanceClick={onEnhance}
      />
    </div>
  );
};

export default FormActions;
