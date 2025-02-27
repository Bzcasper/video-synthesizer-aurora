
import type { Database } from "@/integrations/supabase/types";

export type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
export type EnhancementType = Database["public"]["Enums"]["video_enhancement_type"];
export type FilterType = Database["public"]["Enums"]["video_filter_type"];

export interface Video {
  id: string;
  output_url: string | null;
  created_at: string | null;
  prompt: string;
  status: VideoJobStatus;
  isFavorite?: boolean;
}

export interface Enhancement {
  id: EnhancementType;
  label: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

export interface EnhancementProgress {
  id: string;
  progress: number;
  status: VideoJobStatus;
  estimated_completion_time: string | null;
}
