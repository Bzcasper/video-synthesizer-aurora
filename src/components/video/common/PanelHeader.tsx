
import React from 'react';
import CustomIcon from '@/components/ui/custom-icon';

interface PanelHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  description,
  actions,
  icon
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && <CustomIcon name={icon} className="h-5 w-5 text-aurora-blue" />}
        <div>
          <h2 className="text-2xl font-bold text-gradient bg-gradient-glow">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-gray-400">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="mt-2 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
};
