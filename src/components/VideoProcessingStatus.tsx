// src/components/VideoProcessingStatus.tsx
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useVideoProcessing } from "@/hooks/useVideoProcessing";
import { Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const processingStages = [
  { name: "Initialization", percentage: [0, 10] },
  { name: "Frame Generation", percentage: [10, 40] },
  { name: "Frame Enhancement", percentage: [40, 70] },
  { name: "Video Assembly", percentage: [70, 90] },
  { name: "Final Processing", percentage: [90, 100] },
];

export default function VideoProcessingStatus({ jobId }: { jobId: string }) {
  const {
    status,
    progress,
    isLoading,
    error,
    isComplete,
    isFailed,
    outputUrl,
  } = useVideoProcessing(jobId);
  const [currentStage, setCurrentStage] = useState(processingStages[0]);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    // Determine current stage based on progress
    if (progress <= 10) {
      setCurrentStage(processingStages[0]);
    } else if (progress <= 40) {
      setCurrentStage(processingStages[1]);
    } else if (progress <= 70) {
      setCurrentStage(processingStages[2]);
    } else if (progress <= 90) {
      setCurrentStage(processingStages[3]);
    } else {
      setCurrentStage(processingStages[4]);
    }

    // Calculate estimated time remaining (simplified)
    if (progress > 0 && progress < 100) {
      const remainingPercentage = 100 - progress;
      // Assume 2-5 minutes for 30s video at 1080p (as per spec)
      // Using 3 minutes (180 seconds) as average
      const secondsPerPercent = 180 / 100;
      const secondsRemaining = Math.round(
        remainingPercentage * secondsPerPercent
      );

      if (secondsRemaining < 60) {
        setTimeRemaining(`${secondsRemaining} seconds`);
      } else {
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    } else {
      setTimeRemaining(null);
    }
  }, [progress]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800">Processing Error</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
      </div>
    );
  }

  if (isComplete && outputUrl) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-green-800">
          Processing Complete
        </h3>
        <p className="text-green-600 mt-2">Your video is ready to view</p>
        <div className="mt-4">
          <a
            href={outputUrl}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-green-600 text-white hover:bg-green-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Video
          </a>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800">Processing Failed</h3>
        <p className="text-red-600 mt-2">
          {status?.error || "An error occurred during video processing"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Processing Video</h3>
          <span className="text-sm text-blue-500 font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <div className="bg-blue-100 rounded-full p-2 mr-4">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          </div>
          <div>
            <h4 className="font-medium">{currentStage.name}</h4>
            <p className="text-sm text-gray-500 mt-1">
              {timeRemaining ? (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Estimated time remaining: {timeRemaining}
                </span>
              ) : (
                "Processing your video..."
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t pt-4">
        {processingStages.map((stage, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              progress > stage.percentage[0] ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                progress > stage.percentage[0] ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
            <span className="text-xs mt-1 hidden md:block">{stage.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
