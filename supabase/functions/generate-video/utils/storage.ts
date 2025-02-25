// supabase/functions/generate-video/utils/storage.ts

import { createClient } from '@supabase/supabase-js';
import { SYSTEM } from '../config/constants';
import { ErrorHandler } from '../core/ErrorHandler';
import { logger } from './logging';

/**
 * Interface for file metadata
 */
export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  createdAt: Date;
  updatedAt: Date;
  etag?: string;
}

/**
 * Utility class for Supabase Storage operations
 */
export class StorageUtils {
  private supabase: ReturnType<typeof createClient>;
  private errorHandler: ErrorHandler;
  
  /**
   * Create a new StorageUtils instance
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
   * Ensure the storage bucket exists
   * @param bucketName Bucket name
   * @returns True if bucket exists or was created, false otherwise
   */
  async ensureBucketExists(bucketName: string = SYSTEM.STORAGE.BUCKET): Promise<boolean> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await this.supabase.storage
        .listBuckets();
      
      if (listError) {
        throw this.errorHandler.wrapError(listError, 'Failed to list storage buckets');
      }
      
      // If bucket doesn't exist, create it
      if (!buckets.find(b => b.name === bucketName)) {
        const { error: createError } = await this.supabase.storage
          .createBucket(bucketName, {
            public: true, // Set to false for private storage
          });
        
        if (createError) {
          throw this.errorHandler.wrapError(createError, `Failed to create storage bucket '${bucketName}'`);
        }
        
        logger.info(`Created storage bucket '${bucketName}'`);
      }
      
      return true;
    } catch (error) {
      logger.error(`Error ensuring storage bucket '${bucketName}' exists:`, error);
      return false;
    }
  }
  
  /**
   * Upload a file to storage
   * @param path Storage path for the file
   * @param data File data
   * @param options Upload options
   * @returns Public URL for the uploaded file, or null if upload failed
   */
  async uploadFile(
    path: string,
    data: Uint8Array | string | Blob | File,
    options: {
      bucketName?: string;
      contentType?: string;
      cacheControl?: string;
      upsert?: boolean;
    } = {}
  ): Promise<string | null> {
    const bucketName = options.bucketName || SYSTEM.STORAGE.BUCKET;
    
    try {
      // Ensure bucket exists
      const bucketExists = await this.ensureBucketExists(bucketName);
      
      if (!bucketExists) {
        throw new Error(`Storage bucket '${bucketName}' does not exist`);
      }
      
      // Upload file
      const { error } = await this.supabase.storage
        .from(bucketName)
        .upload(path, data, {
          contentType: options.contentType,
          cacheControl: options.cacheControl || '3600',
          upsert: options.upsert !== undefined ? options.upsert : true,
        });
      
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to upload file to '${path}'`);
      }
      
      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(path);
      
      logger.debug(`Successfully uploaded file to '${path}'`);
      
      return urlData.publicUrl;
    } catch (error) {
      logger.error(`Error uploading file to '${path}':`, error);
      return null;
    }
  }
  
  /**
   * Download a file from storage
   * @param path Storage path for the file
   * @param options Download options
   * @returns File data, or null if download failed
   */
  async downloadFile(
    path: string,
    options: {
      bucketName?: string;
      transform?: {
        width?: number;
        height?: number;
        format?: 'origin' | 'webp' | 'avif';
        quality?: number;
      };
    } = {}
  ): Promise<Uint8Array | null> {
    const bucketName = options.bucketName || SYSTEM.STORAGE.BUCKET;
    
    try {
      let downloadResponse;
      
      // Download file with optional transformations (for images)
      if (options.transform) {
        downloadResponse = await this.supabase.storage
          .from(bucketName)
          .download(path, {
            transform: options.transform,
          });
      } else {
        downloadResponse = await this.supabase.storage
          .from(bucketName)
          .download(path);
      }
      
      const { data, error } = downloadResponse;
      
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to download file from '${path}'`);
      }
      
      if (!data) {
        throw new Error(`No data returned from '${path}'`);
      }
      
      // Convert blob to Uint8Array
      const arrayBuffer = await data.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      logger.debug(`Successfully downloaded file from '${path}'`);
      
      return uint8Array;
    } catch (error) {
      logger.error(`Error downloading file from '${path}':`, error);
      return null;
    }
  }
  
  /**
   * Delete a file from storage
   * @param path Storage path for the file
   * @param options Delete options
   * @returns True if file was deleted, false otherwise
   */
  async deleteFile(
    path: string,
    options: {
      bucketName?: string;
    } = {}
  ): Promise<boolean> {
    const bucketName = options.bucketName || SYSTEM.STORAGE.BUCKET;
    
    try {
      // Delete file
      const { error } = await this.supabase.storage
        .from(bucketName)
        .remove([path]);
      
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to delete file '${path}'`);
      }
      
      logger.debug(`Successfully deleted file '${path}'`);
      
      return true;
    } catch (error) {
      logger.error(`Error deleting file '${path}':`, error);
      return false;
    }
  }
  
  /**
   * List files in a storage path
   * @param path Storage path to list
   * @param options List options
   * @returns Array of file names or metadata objects, or empty array if listing failed
   */
  async listFiles<T extends boolean = false>(
    path: string,
    options: {
      bucketName?: string;
      includeMetadata?: T;
      limit?: number;
      offset?: number;
      sortBy?: {
        column: 'name' | 'created_at' | 'updated_at' | 'last_accessed_at';
        order: 'asc' | 'desc';
      };
    } = {}
  ): Promise<T extends true ? FileMetadata[] : string[]> {
    const bucketName = options.bucketName || SYSTEM.STORAGE.BUCKET;
    
    try {
      // List files
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .list(path, {
          limit: options.limit,
          offset: options.offset,
          sortBy: options.sortBy,
        });
      
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to list files in '${path}'`);
      }
      
      if (!data) {
        return [] as any;
      }
      
      // Return file names or metadata objects
      if (options.includeMetadata) {
        // Convert to FileMetadata objects
        return data.map(item => ({
          name: item.name,
          size: item.metadata?.size || 0,
          contentType: item.metadata?.mimetype || 'application/octet-stream',
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at || item.created_at),
          etag: item.metadata?.etag,
        })) as any;
      } else {
        // Return file names only
        return data.map(item => item.name) as any;
      }
    } catch (error) {
      logger.error(`Error listing files in '${path}':`, error);
      return [] as any;
    }
  }
  
  /**
   * Move a file in storage
   * @param fromPath Source path
   * @param toPath Destination path
   * @param options Move options
   * @returns True if file was moved, false otherwise
   */
  async moveFile(
    fromPath: string,
    toPath: string,
    options: {
      bucketName?: string;
    } = {}
  ): Promise<boolean> {
    const bucketName = options.bucketName || SYSTEM.STORAGE.BUCKET;
    
    try {
      // Move file
      const { error } = await this.supabase.storage
        .from(bucketName)
        .move(fromPath, toPath);
      
      if (error) {
        throw this.errorHandler.wrapError(error, `Failed to move file from '${fromPath}' to '${toPath}'`);
      }
      
      logger.debug(`Successfully moved file from '${fromPath}' to '${toPath}'`);
      
      return true;
    } catch (error) {
      logger.error(`Error moving file from '${fromPath}' to '${toPath}':`, error);
      return false;
    }
  }
  
  /**
   * Get a public URL for a file in storage
   * @param path Storage path for the file
   * @param options URL options
   * @returns Public URL for the file, or null if not found
   */
  getPublicUrl(
    path: string,
    options: {
      bucketName?: string;
      download?: boolean;
      transform?: {
        width?: number;
        height?: number;
        format?: 'origin' | 'webp' | 'avif';
        quality?: number;
      };
    } = {}
  ): string | null {
    const bucketName = options.bucketName || SYSTEM.STORAGE.BUCKET;
    
    try {
      // Get public URL
      let urlData;
      
      if (options.transform) {
        urlData = this.supabase.storage
          .from(bucketName)
          .getPublicUrl(path, {
            download: options.download,
            transform: options.transform,
          });
      } else {
        urlData = this.supabase.storage
          .from(bucketName)
          .getPublicUrl(path, {
            download: options.download,
          });
      }
      
      return urlData.data.publicUrl;
    } catch (error) {
      logger.error(`Error getting public URL for file '${path}':`, error);
      return null;
    }
  }
}
