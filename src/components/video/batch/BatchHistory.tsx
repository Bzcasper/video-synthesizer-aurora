import React from "react";
import { Card } from "@/components/ui/card";
import CustomIcon from "@/components/ui/custom-icon";
import { BatchHistoryItem } from "./BatchHistoryItem";

export const BatchHistory: React.FC = () => {
  return (
    <Card className="glass-panel p-fib-4 rounded-lg hover-glow">
      <div className="flex items-center gap-3 mb-fib-4">
        <CustomIcon name="stats" className="h-fib-3 w-fib-3 text-aurora-blue" />
        <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow">
          Job History
        </h2>
      </div>

      <div className="space-y-3">
        <BatchHistoryItem
          title="Cinematic mountain landscape"
          status="completed"
          timestamp="02/24/2025 10:30 AM"
          onAction={() => console.log("View completed job")}
        />
        <BatchHistoryItem
          title="Futuristic cityscape with neon"
          status="failed"
          timestamp="02/24/2025 5:45 PM"
          onAction={() => console.log("Retry failed job")}
        />
      </div>
    </Card>
  );
};
