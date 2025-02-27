
import React, { ReactNode } from 'react';
import CustomIcon from '@/components/ui/custom-icon';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    icon?: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionButton,
  className = "py-fib-5 px-fib-4 bg-black/20 rounded-lg border border-white/5"
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <CustomIcon name={icon} className="h-fib-5 w-fib-5 text-gray-600 mb-3" />
      <p className="text-gray-400">{title}</p>
      <p className="text-gray-500 text-sm mt-1">
        {description}
      </p>
      
      {actionButton && (
        <Button 
          className="mt-fib-4 bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
          onClick={actionButton.onClick}
        >
          {actionButton.icon && <CustomIcon name={actionButton.icon} className="mr-2 h-5 w-5" />}
          {actionButton.label}
        </Button>
      )}
    </div>
  );
};
