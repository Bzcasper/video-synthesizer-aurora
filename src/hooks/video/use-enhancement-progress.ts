import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { EnhancementProgress, VideoJobStatus } from "./types";

/**
 * Hook to manage and track enhancement progress
 *
 * @returns Enhancement progress state and setter
 */
export function useEnhancementProgress() {
  const [enhancementProgress, setEnhancementProgress] = useState<
    Record<string, EnhancementProgress>
  >({});

  // Fetch active enhancement jobs on component mount and poll for updates
  useEffect(() => {
    const fetchActiveEnhancements = async () => {
      try {
        const { data: enhancementJobs, error } = await supabase
          .from("video_enhancements")
          .select("*")
          .in("status", ["pending", "processing"]);

        if (error) {
          console.error("Error fetching active enhancements:", error);
          return;
        }

        // Update enhancement progress state with active jobs
        if (enhancementJobs && enhancementJobs.length > 0) {
          const progressUpdates: Record<string, EnhancementProgress> = {};

          enhancementJobs.forEach((job) => {
            progressUpdates[job.id] = {
              id: job.id,
              progress: job.progress || 0,
              status: job.status as VideoJobStatus,
              estimated_completion_time: job.estimated_completion_time,
            };
          });

          setEnhancementProgress((prev) => ({
            ...prev,
            ...progressUpdates,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch enhancement jobs:", error);
      }
    };

    // Initialize by fetching active enhancements
    fetchActiveEnhancements();

    // Set up polling for updates (every 3 seconds)
    const pollingInterval = setInterval(fetchActiveEnhancements, 3000);

    // Cleanup polling interval on component unmount
    return () => clearInterval(pollingInterval);
  }, []);

  // Set up realtime subscription for enhancement job updates
  useEffect(() => {
    const enhancementChannel = supabase
      .channel("enhancement-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "video_enhancements",
        },
        (payload) => {
          const updatedJob = payload.new;

          // Update the enhancement progress state with the latest data
          setEnhancementProgress((prev) => ({
            ...prev,
            [updatedJob.id]: {
              id: updatedJob.id,
              progress: updatedJob.progress || 0,
              status: updatedJob.status,
              estimated_completion_time: updatedJob.estimated_completion_time,
            },
          }));

          // Show toast notifications for completed or failed jobs
          if (updatedJob.status === "completed") {
            toast({
              title: "Enhancement completed",
              description:
                "Your video enhancement has been successfully processed.",
            });
          } else if (updatedJob.status === "failed") {
            toast({
              title: "Enhancement failed",
              description:
                "There was an error processing your video enhancement.",
              variant: "destructive",
            });
          }
        },
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(enhancementChannel);
    };
  }, []);

  return { enhancementProgress, setEnhancementProgress };
}
