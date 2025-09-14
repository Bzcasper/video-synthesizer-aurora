import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface DashboardMetrics {
  totalJobs: number;
  averageProcessingTime: number;
  successRate: number;
  activeJobs: number;
}

export async function trackMetric(
  name: string,
  value: number,
  metadata: Record<string, unknown> = {},
) {
  try {
    // Ensure metadata is properly typed as Json
    const metadataJson: Json = metadata as Json;

    await supabase.from("metrics").insert({
      name,
      value,
      metadata: metadataJson,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to track metric:", error);
  }
}

export async function logError(
  message: string,
  context: Record<string, unknown> = {},
) {
  try {
    // Ensure context is properly typed as Json
    const contextJson: Json = context as Json;

    await supabase.from("error_logs").insert({
      error_message: message,
      context: contextJson,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log error:", error);
  }
}

export async function notifyUser(
  userId: string,
  jobId: string,
  message: string,
  type: string,
  metadata: Record<string, unknown> = {},
) {
  try {
    // Ensure metadata is properly typed as Json
    const metadataJson: Json = metadata as Json;

    await supabase.from("notifications").insert({
      user_id: userId,
      job_id: jobId,
      message,
      type,
      metadata: metadataJson,
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const { data: videoJobs } = await supabase
      .from("video_jobs")
      .select("status, processing_time");

    if (!videoJobs)
      return {
        totalJobs: 0,
        averageProcessingTime: 0,
        successRate: 0,
        activeJobs: 0,
      };

    const totalJobs = videoJobs.length;
    const completedJobs = videoJobs.filter(
      (job) => job.status === "completed",
    ).length;
    const activeJobs = videoJobs.filter(
      (job) => job.status === "processing",
    ).length;
    const processingTimes = videoJobs
      .filter((job) => job.processing_time !== null)
      .map((job) => job.processing_time || 0);

    const averageProcessingTime =
      processingTimes.length > 0
        ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
        : 0;

    return {
      totalJobs,
      averageProcessingTime,
      successRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0,
      activeJobs,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return {
      totalJobs: 0,
      averageProcessingTime: 0,
      successRate: 0,
      activeJobs: 0,
    };
  }
}
