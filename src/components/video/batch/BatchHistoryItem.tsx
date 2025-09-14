import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BatchHistoryItemProps {
  title: string;
  status: "completed" | "failed";
  timestamp: string;
  onAction: () => void;
}

export const BatchHistoryItem: React.FC<BatchHistoryItemProps> = ({
  title,
  status,
  timestamp,
  onAction,
}) => {
  const isCompleted = status === "completed";

  return (
    <Card className="glass-panel p-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,166,255,0.3)]">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-aurora-white font-medium">{title}</h3>
          <div
            className={`text-xs mt-1 ${isCompleted ? "text-aurora-green" : "text-red-400"}`}
          >
            {status === "completed" ? "Completed" : "Failed"} • {timestamp}
          </div>
        </div>
        <Button
          variant="default"
          className={`bg-gradient-to-r ${
            isCompleted
              ? "from-aurora-blue to-aurora-green shadow-[0_0_10px_rgba(0,166,255,0.3)] hover:shadow-[0_0_15px_rgba(0,166,255,0.5)]"
              : "from-red-500 to-aurora-purple shadow-[0_0_10px_rgba(138,43,226,0.3)] hover:shadow-[0_0_15px_rgba(138,43,226,0.5)]"
          } text-white transition-all duration-300`}
          onClick={onAction}
        >
          {isCompleted ? "View" : "Retry"}
        </Button>
      </div>
    </Card>
  );
};
