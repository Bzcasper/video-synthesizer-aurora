// supabase/functions/generate-video/config/validation.ts

import { z } from 'zod';
import { VIDEO_SETTINGS, QUOTA } from './constants';

/**
 * Video settings schema for request validation
 */
export const videoSettingsSchema = z.object({
  resolution: z.tuple([z.number().int().positive(), z.number().int().positive()])
    .optional()
    .default([VIDEO_SETTINGS.RESOLUTIONS.FULL_HD[0], VIDEO_SETTINGS.RESOLUTIONS.FULL_HD[1]]),
  fps: z.number().int().min(1).max(60)
    .optional()
    .default(VIDEO_SETTINGS.FPS.STANDARD),
  duration: z.number().min(VIDEO_SETTINGS.DURATION.MIN).max(VIDEO_SETTINGS.DURATION.MAX)
    .optional()
    .default(VIDEO_SETTINGS.DURATION.DEFAULT),
  enhanceFrames: z.boolean()
    .optional()
    .default(true),
  style: z.enum([
    VIDEO_SETTINGS.STYLES.CINEMATIC,
    VIDEO_SETTINGS.STYLES.ANIME,
    VIDEO_SETTINGS.STYLES.REALISTIC,
    VIDEO_SETTINGS.STYLES.ARTISTIC
  ])
    .optional()
    .default(VIDEO_SETTINGS.STYLES.CINEMATIC),
  outputFormat: z.enum([VIDEO_SETTINGS.FORMATS.MP4, VIDEO_SETTINGS.FORMATS.WEBM])
    .optional()
    .default(VIDEO_SETTINGS.FORMATS.MP4),
  quality: z.enum([VIDEO_SETTINGS.QUALITY.DRAFT, VIDEO_SETTINGS.QUALITY.STANDARD, VIDEO_SETTINGS.QUALITY.HIGH])
    .optional()
    .default(VIDEO_SETTINGS.QUALITY.STANDARD),
});

/**
 * Video generation request schema
 */
export const videoGenerationRequestSchema = z.object({
  userId: z.string().min(1),
  prompt: z.string().min(1).max(1000),
  settings: videoSettingsSchema,
  userTier: z.enum(['free', 'pro']).default('free'),
  callbackUrl: z.string().url().optional(),
});

/**
 * Types for validated schemas
 */
export type VideoSettings = z.infer<typeof videoSettingsSchema>;
export type VideoGenerationRequest = z.infer<typeof videoGenerationRequestSchema>;

/**
 * Validate the video generation request
 * @param request Request object to validate
 * @returns Validated request object
 * @throws {Error} If validation fails
 */
export const validateRequest = (request: any): VideoGenerationRequest => {
  try {
    return videoGenerationRequestSchema.parse(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation error: ${errorMessage}`);
    }
    throw error;
  }
};

/**
 * Normalize settings based on user tier
 * @param settings User settings
 * @param userTier User's tier (free or pro)
 * @returns Normalized settings
 */
export const normalizeSettings = (settings: VideoSettings, userTier: 'free' | 'pro' = 'free'): VideoSettings => {
  const tierLimits = userTier === 'pro' ? QUOTA.PRO_TIER : QUOTA.FREE_TIER;
  const maxResolution = 
    userTier === 'pro' 
      ? VIDEO_SETTINGS.RESOLUTIONS.FULL_HD 
      : VIDEO_SETTINGS.RESOLUTIONS.HD;
  
  return {
    ...settings,
    // Limit duration based on tier
    duration: Math.min(settings.duration, tierLimits.MAX_DURATION),
    // Limit resolution based on tier
    resolution: [
      Math.min(settings.resolution[0], maxResolution[0]),
      Math.min(settings.resolution[1], maxResolution[1])
    ],
  };
};