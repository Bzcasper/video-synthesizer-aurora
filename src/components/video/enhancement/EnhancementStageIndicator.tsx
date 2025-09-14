import React from "react";

interface EnhancementStageIndicatorProps {
  stages: {
    id: string;
    label: string;
    isActive: boolean;
    isCompleted: boolean;
  }[];
}

export const EnhancementStageIndicator: React.FC<
  EnhancementStageIndicatorProps
> = ({ stages }) => {
  return (
    <div className="flex justify-between items-center mt-3">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div className="flex items-center space-x-2">
            <div
              className={`h-4 w-4 rounded-full ${
                stage.isCompleted
                  ? "bg-aurora-green"
                  : stage.isActive
                    ? "bg-aurora-purple animate-pulse"
                    : "bg-gray-800"
              }`}
            />
            <span
              className={`text-sm ${
                stage.isActive
                  ? "text-aurora-white"
                  : stage.isCompleted
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
            >
              {stage.label}
            </span>
          </div>

          {index < stages.length - 1 && (
            <div className="h-0.5 flex-1 bg-gray-800 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
