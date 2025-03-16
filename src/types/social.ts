
// Platform types
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'facebook';

// Video generation options
export interface VideoGenerationOptions {
  voiceStyle: 'conversational' | 'professional' | 'energetic' | 'calm';
  visualStyle: 'modern' | 'minimal' | 'vibrant' | 'corporate';
  musicType: 'upbeat' | 'relaxed' | 'inspirational' | 'corporate' | 'none';
  duration: number;
  includeIntro: boolean;
  includeCaptions: boolean;
}

// Generated video result
export interface GeneratedVideo {
  id: string;
  platform: Platform;
  url: string;
  thumbnailUrl: string;
  aspectRatio: string;
  duration: number;
  createdAt: string;
}

// Blog content section
export interface ContentSection {
  text: string;
  importance: number;
  type: 'intro' | 'body' | 'conclusion' | 'quote' | 'statistic';
}

// Social video formatting specs
export interface PlatformSpec {
  platform: Platform;
  aspectRatio: string;
  maxDuration: number;
  recommendedDuration: number;
  format: string;
  resolution: {
    width: number;
    height: number;
  };
}

// Platform specs reference
export const PLATFORM_SPECS: Record<Platform, PlatformSpec> = {
  instagram: {
    platform: 'instagram',
    aspectRatio: '9:16',
    maxDuration: 60,
    recommendedDuration: 30,
    format: 'mp4',
    resolution: {
      width: 1080,
      height: 1920
    }
  },
  tiktok: {
    platform: 'tiktok',
    aspectRatio: '9:16',
    maxDuration: 180,
    recommendedDuration: 30,
    format: 'mp4',
    resolution: {
      width: 1080,
      height: 1920
    }
  },
  youtube: {
    platform: 'youtube',
    aspectRatio: '9:16',
    maxDuration: 60,
    recommendedDuration: 30,
    format: 'mp4',
    resolution: {
      width: 1080,
      height: 1920
    }
  },
  facebook: {
    platform: 'facebook',
    aspectRatio: '9:16',
    maxDuration: 60,
    recommendedDuration: 30,
    format: 'mp4',
    resolution: {
      width: 1080,
      height: 1920
    }
  }
};
