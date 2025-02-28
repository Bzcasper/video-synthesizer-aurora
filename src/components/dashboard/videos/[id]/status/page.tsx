// src/app/dashboard/videos/status/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VideoProcessingStatus from "@/components/VideoProcessingStatus";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function VideoStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("jobId");
    if (id) {
      setJobId(id);
    } else {
      // If no jobId is provided, redirect to videos page
      router.push("/dashboard/videos");
    }
  }, [searchParams, router]);

  if (!jobId) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Video Processing Status</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.push("/dashboard/videos")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Videos
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <VideoProcessingStatus jobId={jobId} />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            You can leave this page and check back later. The video will
            continue processing.
          </p>
          <Button
            variant="outline"
            className="flex items-center gap-2 mx-auto"
            onClick={() => router.refresh()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>
        </div>
      </div>
    </div>
  );
}
