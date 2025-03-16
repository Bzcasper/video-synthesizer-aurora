
import React from 'react';

interface PanelHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  description,
  actions
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold text-gradient bg-gradient-glow">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-gray-400">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-2 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
};
