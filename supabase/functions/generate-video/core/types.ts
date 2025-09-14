export interface VideoJob {
  id: string;
  userId: string;
  prompt: string;
  settings: {
    duration: number;
    resolution: [number, number];
    fps: number;
    style: string;
  };
  createdAt: Date;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  error?: string;
  outputUrl?: string;
  thumbnailUrl?: string;
}

export interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl: string;
}
