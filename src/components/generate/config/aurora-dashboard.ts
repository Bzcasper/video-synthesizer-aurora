// supabase/functions/generate-video/config/constants.ts

/**
 * Configuration constants for video generation service
 */

// Video generation settings
export const VIDEO_SETTINGS = {
  // Resolution presets (width x height)
  RESOLUTIONS: {
    SD: [640, 360],
    HD: [1280, 720],
    FULL_HD: [1920, 1080],
  },

  // Video duration limits in seconds
  DURATION: {
    MIN: 5,
    MAX: 60,
    DEFAULT: 15,
  },

  // Frame rate options
  FPS: {
    STANDARD: 24,
    SMOOTH: 30,
    HIGH: 60,
  },

  // Video style presets
  STYLES: {
    CINEMATIC: "cinematic",
    ANIME: "anime",
    REALISTIC: "realistic",
    ARTISTIC: "artistic",
  },

  // Output formats
  FORMATS: {
    MP4: "mp4",
    WEBM: "webm",
  },

  // Video quality presets (affects bitrate and compression)
  QUALITY: {
    DRAFT: "draft", // Lower quality for previews
    STANDARD: "standard", // Good balance of quality and file size
    HIGH: "high", // High quality, larger file size
  },
};

// System settings
export const SYSTEM = {
  // Concurrency limits
  MAX_CONCURRENT_JOBS: 5,

  // Job timeout in milliseconds
  JOB_TIMEOUT: 15 * 60 * 1000, // 15 minutes

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 seconds

  // Storage paths
  STORAGE: {
    BUCKET: "video-assets",
    FRAMES_PATH: "frames",
    VIDEOS_PATH: "videos",
    THUMBNAILS_PATH: "thumbnails",
  },

  // Progress update interval in milliseconds
  PROGRESS_UPDATE_INTERVAL: 2000, // 2 seconds
};

// Rate limiting and quota settings
export const QUOTA = {
  // Default user limits per month
  FREE_TIER: {
    MAX_VIDEOS: 10,
    MAX_DURATION: 15, // seconds
    MAX_RESOLUTION: "HD", // Maps to VIDEO_SETTINGS.RESOLUTIONS.HD
  },

  PRO_TIER: {
    MAX_VIDEOS: 100,
    MAX_DURATION: 60, // seconds
    MAX_RESOLUTION: "FULL_HD", // Maps to VIDEO_SETTINGS.RESOLUTIONS.FULL_HD
  },

  // Rate limiting (requests per minute)
  RATE_LIMIT: {
    FREE_TIER: 5,
    PRO_TIER: 20,
  },
};

// Database table names
export const DB_TABLES = {
  VIDEO_JOBS: "video_jobs",
  VIDEO_ASSETS: "video_assets",
  MONTHLY_USAGE: "monthly_usage",
};

// Webhook event types
export const WEBHOOK_EVENTS = {
  JOB_CREATED: "job.created",
  JOB_STARTED: "job.started",
  JOB_PROGRESS: "job.progress",
  JOB_COMPLETED: "job.completed",
  JOB_FAILED: "job.failed",
};

// Error types for categorization
export const ERROR_TYPES = {
  VALIDATION: "validation_error",
  SYSTEM: "system_error",
  MODEL: "model_error",
  STORAGE: "storage_error",
  TIMEOUT: "timeout_error",
  UNKNOWN: "unknown_error",
};
