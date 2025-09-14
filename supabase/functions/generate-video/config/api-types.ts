// supabase/functions/generate-video/config/api-types.ts

/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Video generation job response
 */
export interface JobResponse {
  jobId: string;
  userId: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  progress: number;
  stage?: string;
  prompt: string;
  settings: {
    resolution: [number, number];
    fps: number;
    duration: number;
    enhanceFrames: boolean;
    style: string;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  outputUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  estimatedTimeRemaining?: number;
}

/**
 * Queue stats response
 */
export interface QueueStatsResponse {
  totalJobs: number;
  pendingJobs: number;
  processingJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageWaitTime: number | null;
  averageProcessingTime: number | null;
  estimatedWaitTime: number | null;
}

/**
 * Job creation request
 */
export interface CreateJobRequest {
  userId: string;
  prompt: string;
  settings: {
    resolution?: [number, number];
    fps?: number;
    duration?: number;
    enhanceFrames?: boolean;
    style?: string;
    outputFormat?: string;
    quality?: string;
  };
  userTier?: "free" | "pro";
  callbackUrl?: string;
}

/**
 * Job action request (cancel, restart)
 */
export interface JobActionRequest {
  jobId: string;
  userId: string;
}
