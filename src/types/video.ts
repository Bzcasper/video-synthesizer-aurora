
// Video operation types matching Supabase enums
export type VideoEditOperation = 'trim' | 'subtitle' | 'filter' | 'speed';

export type VideoJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface EditParameters {
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
