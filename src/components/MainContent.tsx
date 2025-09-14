import React from "react";
import VideoPreview from "@/components/VideoPreview";
import VideoJobsList from "@/components/VideoJobsList";

interface VideoJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  output_url: string | null;
  created_at: string;
  error_message?: string;
}

interface MainContentProps {
  videoJobs?: VideoJob[];
}

const MainContent = ({ videoJobs }: MainContentProps) => {
  return (
    <div className="flex-1 glass-panel p-6 hover-glow transition-all">
      <VideoPreview />
      <VideoJobsList jobs={videoJobs} />
    </div>
  );
};

export default MainContent;
