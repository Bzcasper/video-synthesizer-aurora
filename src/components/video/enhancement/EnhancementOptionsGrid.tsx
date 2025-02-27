
import React from 'react';
import type { Enhancement } from '@/hooks/use-video-enhancements';
import { EnhancementCard } from './EnhancementCard';

interface EnhancementOptionsGridProps {
  enhancements: Enhancement[];
  selectedEnhancement: Enhancement | null;
  onSelectEnhancement: (enhancement: Enhancement) => void;
}

export const EnhancementOptionsGrid: React.FC<EnhancementOptionsGridProps> = ({ 
  enhancements, 
  selectedEnhancement, 
  onSelectEnhancement 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {enhancements.map((enhancement) => (
        <EnhancementCard
          key={enhancement.id}
          enhancement={enhancement}
          isSelected={selectedEnhancement?.id === enhancement.id}
          onSelect={() => onSelectEnhancement(enhancement)}
        />
      ))}
    </div>
  );
};
