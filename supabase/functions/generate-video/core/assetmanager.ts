// supabase/functions/generate-video/core/AssetManager.ts

import { createClient } from '@supabase/supabase-js';
import { SYSTEM, DB_TABLES } from '../config/constants';
import { ErrorHandler } from './ErrorHandler';
import { logger } from '../utils/logging';

/**
 * Interface for asset storage options
 */
interface StorageOptions {
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

/**
 * Interface for saved video assets result
 */
export interface SavedVideoAssets {
  videoUrl: string;
  thumbnailUrl: string;
}

/**
 * Class for managing video generation assets using Supabase Storage
 */
export class AssetManager {
  private supabase: ReturnType<typeof createClient>;
  private errorHandler: ErrorHandler;
  
  /**
   * Creates a new AssetManager instance
   * @param supabaseClient Initialized Supabase client
   * @param errorHandler Error handler instance
   */
  constructor(
    supabaseClient: ReturnType<typeof createClient>,
    errorHandler: ErrorHandler
  ) {
    this.supabase = supabaseClient;
    this.errorHandler = errorHandler;
  }
  
  /**
   * Save video frames to storage for later processing
   * @param jobId Job identifier
   * @param frames Array of frame data
   * @returns Array of frame URLs
   */
  async saveFrames(jobId: string, frames: Uint8Array[]): Promise<string[]> {
    logger.info(`Saving ${frames.length} frames for job ${jobId}`);
    
    try {
      const frameUrls: string[] = [];
      
      for (let i = 0; i < frames.length; i++) {
        const frameNumber = i.toString().padStart(6, '0');
        const path = `${SYSTEM.STORAGE.FRAMES_PATH}/${jobId}/frame_${frameNumber}.png`;
        
        // Upload frame to storage
        const { data, error } = await this.supabase.storage
          .from(SYSTEM.STORAGE.BUCKET)
          .upload(path, frames[i], {
            contentType: 'image/png',
            cacheControl: '3600',
            upsert: false,
          });
        
        if (error) {
          throw this.errorHandler.wrapError(error, `Failed to upload frame ${i} for job ${jobId}`);
        }
        
        // Get public URL for the frame
        const { data: urlData } = this.supabase.storage
          .from(SYSTEM.STORAGE.BUCKET)
          .getPublicUrl(path);
        
        frameUrls.push(urlData.publicUrl);
        
        // Log progress periodically
        if (i % 10 === 0 || i === frames.length - 1) {
          logger.debug(`Saved ${i + 1}/${frames.length} frames for job ${jobId}`);
        }
      }
      
      logger.info(`Successfully saved ${frames.length} frames for job ${jobId}`);
      
      // Record frame assets in database
      await this.recordAssets(jobId, frameUrls, 'frame');
      
      return frameUrls;
    } catch (error) {
      logger.error(`Error saving frames for job ${jobId}:`, error);
      throw this.errorHandler.wrapError(error, `Failed to save frames for job ${jobId}`);
    }
  }
  
  /**
   * Save final video and thumbnail to storage
   * @param jobId Job identifier
   * @param videoData Video binary data
   * @param thumbnailData Thumbnail binary data
   * @returns Object containing video and thumbnail URLs
   */
  async saveVideoAssets(
    jobId: string,
    videoData: Uint8Array,
    thumbnailData: Uint8Array
  ): Promise<SavedVideoAssets> {
    logger.info(`Saving video assets for job ${jobId}`);
    
    try {
      // Upload video file
      const videoPath = `${SYSTEM.STORAGE.VIDEOS_PATH}/${jobId}/video.mp4`;
      const { error: videoError } = await this.supabase.storage
        .from(SYSTEM.STORAGE.BUCKET)
        .upload(videoPath, videoData, {
          contentType: 'video/mp4',
          cacheControl: '3600',
          upsert: true,
        });
        
      if (videoError) {
        throw this.errorHandler.wrapError(videoError, `Failed to upload video for job ${jobId}`);
      }
      
      // Upload thumbnail
      const thumbnailPath = `${SYSTEM.STORAGE.THUMBNAILS_PATH}/${jobId}/thumbnail.jpg`;
      const { error: thumbnailError } = await this.supabase.storage
        .from(SYSTEM.STORAGE.BUCKET)
        .upload(thumbnailPath, thumbnailData, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true,
        });
        
      if (thumbnailError) {
        throw this.errorHandler.wrapError(thumbnailError, `Failed to upload thumbnail for job ${jobId}`);
      }
      
      // Get public URLs
      const { data: videoUrlData } = this.supabase.storage
        .from(SYSTEM.STORAGE.BUCKET)
        .getPublicUrl(videoPath);
        
      const { data: thumbnailUrlData } = this.supabase.storage
        .from(SYSTEM.STORAGE.BUCKET)
        .getPublicUrl(thumbnailPath);
      
      const result = {
        videoUrl: videoUrlData.publicUrl,
        thumbnailUrl: thumbnailUrlData.publicUrl,
      };
      
      // Record assets in database
      await this.recordAssets(jobId, [result.videoUrl], 'video');
      await this.recordAssets(jobId, [result.thumbnailUrl], 'thumbnail');
      
      logger.info(`Successfully saved video assets for job ${jobId}`);
      
      return result;
    } catch (error) {
      logger.error(`Error saving video assets for job ${jobId}:`, error);
      throw this.errorHandler.wrapError(error, `Failed to save video assets for job ${jobId}`);
    }
  }
  
  /**
   * Record asset metadata in the database
   * @param jobId Job identifier
   * @param urls Asset URLs
   * @param type Asset type (frame, video, thumbnail)
   * @private
   */
  private async recordAssets(jobId: string, urls: string[], type: 'frame' | 'video' | 'thumbnail'): Promise<void> {
    try {
      // Prepare assets records
      const assetRecords = urls.map((url, index) => ({
        job_id: jobId,
        asset_type: type,
        asset_url: url,
        sequence: index,
        created_at: new Date().toISOString(),
      }));
      
      // Insert asset records into database
      const { error } = await this.supabase
        .from(DB_TABLES.VIDEO_ASSETS)
        .insert(assetRecords);
        
      if (error) {
        logger.error(`Error recording assets in database for job ${jobId}:`, error);
        // We don't throw here to avoid failing the entire process just because of metadata recording
      }
    } catch (error) {
      logger.error(`Error recording assets in database for job ${jobId}:`, error);
      // We don't throw here to avoid failing the entire process just because of metadata recording
    }
  }
  
  /**
   * Clean up temporary assets for a job
   * @param jobId Job identifier
   * @param keepFinalAssets Whether to keep the final video and thumbnail
   */
  async cleanupJobAssets(jobId: string, keepFinalAssets = true): Promise<void> {
    logger.info(`Cleaning up assets for job ${jobId}`);
    
    try {
      // Delete frame files if they exist
      const framePath = `${SYSTEM.STORAGE.FRAMES_PATH}/${jobId}`;
      await this.deleteFolder(framePath);
      
      // Optionally delete final assets
      if (!keepFinalAssets) {
        const videoPath = `${SYSTEM.STORAGE.VIDEOS_PATH}/${jobId}`;
        const thumbnailPath = `${SYSTEM.STORAGE.THUMBNAILS_PATH}/${jobId}`;
        
        await this.deleteFolder(videoPath);
        await this.deleteFolder(thumbnailPath);
      }
      
      logger.info(`Successfully cleaned up assets for job ${jobId}`);
    } catch (error) {
      logger.error(`Error cleaning up assets for job ${jobId}:`, error);
      // Log but don't throw to avoid failing the main process due to cleanup issues
    }
  }
  
  /**
   * Delete a folder and all its contents from storage
   * @param folderPath Path to the folder
   * @private
   */
  private async deleteFolder(folderPath: string): Promise<void> {
    try {
      // List all files in the folder
      const { data: files, error: listError } = await this.supabase.storage
        .from(SYSTEM.STORAGE.BUCKET)
        .list(folderPath);
        
      if (listError) {
        throw listError;
      }
      
      if (!files || files.length === 0) {
        return; // No files to delete
      }
      
      // Create array of file paths to delete
      const filePaths = files.map(file => `${folderPath}/${file.name}`);
      
      // Delete the files
      const { error: deleteError } = await this.supabase.storage
        .from(SYSTEM.STORAGE.BUCKET)
        .remove(filePaths);
        
      if (deleteError) {
        throw deleteError;
      }
    } catch (error) {
      logger.error(`Error deleting folder ${folderPath}:`, error);
      // Log but don't throw
    }
  }
  
  /**
   * Get the size of assets in bytes
   * @param jobId Job identifier
   * @returns Total size in bytes
   */
  async getAssetsSize(jobId: string): Promise<number> {
    let totalSize = 0;
    
    try {
      // Get assets from database
      const { data: assets, error } = await this.supabase
        .from(DB_TABLES.VIDEO_ASSETS)
        .select('asset_url, asset_type')
        .eq('job_id', jobId);
        
      if (error) {
        throw error;
      }
      
      if (!assets || assets.length === 0) {
        return 0;
      }
      
      // For a real implementation, you would need to get the size of each asset
      // This could be done by metadata lookup or by implementing a function to
      // get the size of each file in storage
      
      // For now, we'll return a placeholder value
      totalSize = assets.length * 1024 * 1024; // Assume 1MB per asset
      
      return totalSize;
    } catch (error) {
      logger.error(`Error getting assets size for job ${jobId}:`, error);
      return 0; // Return 0 if there's an error
    }
  }
}
