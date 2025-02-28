// src/hooks/useVideoProcessing.ts
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVideoStatus } from "@/lib/api/modalApi";
import { supabase } from "@/lib/supabase";
import type { VideoJobStatus } from "@/types/video";

export function useVideoProcessing(jobId: string | null) {
  const [status, setStatus] = useState<VideoJobStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["videoStatus", jobId],
    queryFn: () => (jobId ? getVideoStatus(jobId) : null),
    enabled: !!jobId,
    refetchInterval: (data) => {
      // Poll frequently during processing, stop when complete
      return data?.status === "completed" || data?.status === "failed"
        ? false
        : 5000;
    },
  });

  useEffect(() => {
    if (!jobId) return;

    // Set up realtime subscription for status updates
    const channel = supabase
      .channel(`job-${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "video_jobs",
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          setStatus(payload.new as VideoJobStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  useEffect(() => {
    if (data) {
      setStatus(data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      setError(new Error("Failed to fetch video processing status"));
    }
  }, [isError]);

  return {
    status: status,
    isLoading,
    error,
    progress: status?.progress || 0,
    outputUrl: status?.output_url || null,
    thumbnailUrl: status?.thumbnail_url || null,
    isComplete: status?.status === "completed",
    isFailed: status?.status === "failed",
  };
}
