
import { Database } from "@/integrations/supabase/types";

type Json = Database['public']['CompositeTypes']['json'];

// Video operation types matching Supabase enums
export type VideoEditOperation = 'trim' | 'subtitle' | 'filter' | 'speed';

export type VideoJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Making EditParameters compatible with Json type by ensuring all properties are JSON-serializable
export interface EditParameters {
  [key: string]: unknown; // Add index signature
  trim?: {
    startTime: number;
    endTime: number;
  };
  filter?: {
    type: 'cinematic' | 'vintage' | 'anime' | 'none';
  };
  speed?: {
    rate: number;
  };
  subtitle?: {
    text: string;
    position?: 'top' | 'bottom';
  };
}
