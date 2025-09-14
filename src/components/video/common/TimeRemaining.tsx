import React from "react";
import { Clock } from "lucide-react";

export interface TimeRemainingProps {
  timeRemaining: number;
}

export const TimeRemaining: React.FC<TimeRemainingProps> = ({
  timeRemaining,
}) => {
  // Format seconds into minutes and seconds
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "Complete";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s remaining`;
    }
    return `${remainingSeconds}s remaining`;
  };

  return (
    <div className="flex items-center text-sm text-gray-400 mt-1">
      <Clock className="h-4 w-4 mr-2 text-aurora-blue" />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
};
