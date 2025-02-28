// src/lib/api/modalApi.ts
import { createClient } from "@supabase/supabase-js";
import type { VideoGenerationParams, VideoJobStatus } from "@/types/video";

const MODAL_API_ENDPOINT = process.env.NEXT_PUBLIC_MODAL_API_ENDPOINT;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

export async function generateVideo(
  params: VideoGenerationParams
): Promise<{ jobId: string }> {
  try {
    const response = await fetch(`${MODAL_API_ENDPOINT}/generate-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate video");
    }

    const data = await response.json();

    // Store job metadata in Supabase for tracking
    await supabase.from("video_jobs").insert({
      id: data.jobId,
      user_id: params.userId,
      prompt: params.prompt,
      duration: params.duration,
      resolution: params.resolution,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    return { jobId: data.jobId };
  } catch (error) {
    console.error("Video generation request failed:", error);
    throw error;
  }
}

export async function getVideoStatus(jobId: string): Promise<VideoJobStatus> {
  try {
    const response = await fetch(
      `${MODAL_API_ENDPOINT}/video-status?jobId=${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch video status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching video status:", error);
    throw error;
  }
}

async function getAuthToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || "";
}
