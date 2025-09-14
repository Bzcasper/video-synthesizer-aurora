import React from "react";

interface StatusIndicatorProps {
  status:
    | "processing"
    | "completed"
    | "failed"
    | "pending"
    | "queued"
    | "paused";
  showLabel?: boolean;
  labelMap?: Record<string, string>;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showLabel = true,
  labelMap,
  className = "",
}) => {
  const defaultLabelMap = {
    processing: "Processing",
    completed: "Completed",
    failed: "Failed",
    pending: "Queued",
    queued: "Queued",
    paused: "Paused",
  };

  const labels = { ...defaultLabelMap, ...labelMap };

  const getIndicatorColor = () => {
    switch (status) {
      case "processing":
        return "bg-aurora-blue animate-pulse";
      case "completed":
        return "bg-aurora-green";
      case "failed":
        return "bg-red-500";
      case "paused":
        return "bg-amber-400";
      default:
        return "bg-aurora-purple";
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`h-2 w-2 rounded-full ${getIndicatorColor()}`} />
      {showLabel && (
        <span className="text-sm text-aurora-white">{labels[status]}</span>
      )}
    </div>
  );
};
