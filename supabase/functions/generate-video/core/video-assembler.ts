
import { createClient } from '@supabase/supabase-js';
import { VIDEO_SETTINGS, SYSTEM } from '../config/constants';
import { logger } from '../utils/logging';
import { VideoJob } from './types';

export class VideoAssembler {
  private supabase: ReturnType<typeof createClient>;

  constructor(supabaseClient: ReturnType<typeof createClient>) {
    this.supabase = supabaseClient;
  }

  async assembleVideo(
    frames: Uint8Array[],
    job: VideoJob
  ): Promise<{ videoUrl: string; thumbnailUrl: string }> {
    logger.info(`Assembling video for job ${job.id}`);

    try {
      const { videoData, thumbnailData } = await this.combineFrames(frames, job);
      const { videoUrl, thumbnailUrl } = await this.uploadResults(job.id, videoData, thumbnailData);

      return { videoUrl, thumbnailUrl };
    } catch (error) {
      logger.error(`Error assembling video for job ${job.id}:`, error);
      throw error;
    }
  }

  private async combineFrames(
    frames: Uint8Array[],
    job: VideoJob
  ): Promise<{ videoData: Uint8Array; thumbnailData: Uint8Array }> {
    logger.info(`Combining frames for job ${job.id}`);

    try {
      const encoder = await this.initializeVideoEncoder(job.settings);
      const videoData = await encoder.encode(frames, {
        fps: job.settings.fps,
        quality: VIDEO_SETTINGS.QUALITY.HIGH
      });

      const middleFrameIndex = Math.floor(frames.length / 2);
      const thumbnailData = frames[middleFrameIndex];

      return { videoData, thumbnailData };
    } catch (error) {
      logger.error(`Error combining frames for job ${job.id}:`, error);
      throw error;
    }
  }

  private async uploadResults(
    jobId: string,
    videoData: Uint8Array,
    thumbnailData: Uint8Array
  ): Promise<{ videoUrl: string; thumbnailUrl: string }> {
    logger.info(`Uploading results for job ${jobId}`);

    try {
      const videoPath = `${SYSTEM.STORAGE.VIDEOS_PATH}/${jobId}/output.mp4`;
      const { error: videoError } = await this.supabase.storage
        .from('video-assets')
        .upload(videoPath, videoData, {
          contentType: 'video/mp4',
          cacheControl: '3600',
          upsert: true
        });

      if (videoError) throw videoError;

      const thumbnailPath = `${SYSTEM.STORAGE.THUMBNAILS_PATH}/${jobId}/thumbnail.jpg`;
      const { error: thumbnailError } = await this.supabase.storage
        .from('video-thumbnails')
        .upload(thumbnailPath, thumbnailData, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (thumbnailError) throw thumbnailError;

      const { data: videoUrlData } = this.supabase.storage
        .from('video-assets')
        .getPublicUrl(videoPath);

      const { data: thumbnailUrlData } = this.supabase.storage
        .from('video-thumbnails')
        .getPublicUrl(thumbnailPath);

      return {
        videoUrl: videoUrlData.publicUrl,
        thumbnailUrl: thumbnailUrlData.publicUrl
      };
    } catch (error) {
      logger.error(`Error uploading results for job ${jobId}:`, error);
      throw error;
    }
  }

  private async initializeVideoEncoder(settings: VideoJob['settings']) {
    logger.info('Initializing video encoder');
    return {
      encode: async (frames: Uint8Array[], options: any) => {
        // Placeholder for actual video encoding
        return new Uint8Array(1024);
      }
    };
  }
}
