
import React from 'react';

interface TimeRemainingProps {
  timeRemaining: string | null;
  className?: string;
  prefix?: string;
}

export const TimeRemaining: React.FC<TimeRemainingProps> = ({ 
  timeRemaining, 
  className = "text-xs text-gray-400",
  prefix = "Estimated completion: "
}) => {
  if (!timeRemaining) return null;
  
  return (
    <p className={className}>
      {prefix}{timeRemaining}
    </p>
  );
};
