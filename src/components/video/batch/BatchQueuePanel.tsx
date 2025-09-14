import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "../common/EmptyState";
import { BatchJobCard, BatchJob } from "./BatchJobCard";
import { PanelHeader } from "../common/PanelHeader";
import { StatusIndicator } from "../common/StatusIndicator";
import { Pause, RefreshCw } from "lucide-react";
import { CustomIcon } from "@/components/ui/custom-icon";

export const BatchQueuePanel: React.FC = () => {
  const [activeJobs, setActiveJobs] = React.useState<BatchJob[]>([
    {
      id: "job-1",
      title: "Ocean waves at sunset",
      progress: 45,
      status: "processing",
      timeRemaining: "12:30",
    },
    {
      id: "job-2",
      title: "Urban night timelapse",
      progress: 10,
      status: "pending",
      timeRemaining: "25:45",
    },
    {
      id: "job-3",
      title: "Mountain forest aerial",
      progress: 0,
      status: "pending",
      timeRemaining: "32:15",
    },
  ]);

  const handleCancel = (jobId: string) => {
    setActiveJobs(activeJobs.filter((job) => job.id !== jobId));
  };

  const handleSettings = (jobId: string) => {
    console.log("Settings for job", jobId);
    // Add settings logic here
  };

  if (activeJobs.length === 0) {
    return (
      <EmptyState
        icon="batch"
        title="No active batch processing jobs"
        description="Generate or enhance videos to add them to the queue"
        actionButton={{
          label: "Generate New Video",
          icon: "generate",
          onClick: () => (window.location.href = "/dashboard/generate"),
        }}
      />
    );
  }

  return (
    <Card className="glass-panel p-fib-4 hover-glow">
      <PanelHeader
        title="Processing Queue"
        description="Your videos are being processed in the order shown below"
        icon="batch"
      />

      <div className="flex items-center justify-between mb-fib-4">
        <StatusIndicator status="processing" showLabel={true} />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-gray-300 hover:text-aurora-purple hover:border-aurora-purple/50 hover:shadow-[0_0_8px_rgba(138,43,226,0.3)] transition-all duration-300"
          >
            <span className="w-4 h-4">
              <CustomIcon name="pause" />
            </span>
            <span className="font-medium">Pause All</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-gray-300 hover:text-aurora-blue hover:border-aurora-blue/50 hover:shadow-[0_0_8px_rgba(0,166,255,0.3)] transition-all duration-300"
          >
            <span className="w-4 h-4">
              <CustomIcon name="refresh" />
            </span>
            <span className="font-medium">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="space-y-fib-3">
        {activeJobs.map((job, index) => (
          <BatchJobCard
            key={job.id}
            job={job}
            onCancel={handleCancel}
            onSettings={handleSettings}
            index={index}
          />
        ))}
      </div>
    </Card>
  );
};
