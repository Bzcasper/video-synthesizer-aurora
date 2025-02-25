
import { createClient } from '@supabase/supabase-js';
import { ErrorHandler } from './ErrorHandler';
import { ProgressTracker } from './ProgressTracker';
import { FrameGenerator } from './frame-generator';
import { FrameEnhancer } from './frame-enhancer';
import { VideoAssembler } from './video-assembler';
import { VideoJob, VideoGenerationResult } from './types';
import { logger } from '../utils/logging';

export class VideoGenerator {
  private supabase: ReturnType<typeof createClient>;
  private errorHandler: ErrorHandler;
  private progressTracker: ProgressTracker;
  private frameGenerator: FrameGenerator;
  private frameEnhancer: FrameEnhancer;
  private videoAssembler: VideoAssembler;

  constructor(
    supabaseClient: ReturnType<typeof createClient>,
    errorHandler: ErrorHandler,
    progressTracker: ProgressTracker
  ) {
    this.supabase = supabaseClient;
    this.errorHandler = errorHandler;
    this.progressTracker = progressTracker;
    this.frameGenerator = new FrameGenerator();
    this.frameEnhancer = new FrameEnhancer();
    this.videoAssembler = new VideoAssembler(supabaseClient);
  }

  async generateVideo(job: VideoJob): Promise<VideoGenerationResult> {
    logger.info(`Starting video generation for job ${job.id}`);
    
    try {
      // Update progress to indicate we're starting
      await this.progressTracker.updateProgress(job.id, 5, 'Initializing video generation');

      // Generate frames using Stable Video Diffusion
      const frames = await this.frameGenerator.generateFrames(job);
      await this.progressTracker.updateProgress(job.id, 40, 'Frames generated');

      // Process and enhance frames
      const enhancedFrames = await this.frameEnhancer.enhanceFrames(frames, job.id);
      await this.progressTracker.updateProgress(job.id, 70, 'Frames enhanced');

      // Combine frames into video and upload
      const { videoUrl, thumbnailUrl } = await this.videoAssembler.assembleVideo(enhancedFrames, job);
      await this.progressTracker.updateProgress(job.id, 100, 'Video ready');

      return { videoUrl, thumbnailUrl };
    } catch (error) {
      logger.error(`Error generating video for job ${job.id}:`, error);
      throw this.errorHandler.wrapError(error, `Failed to generate video for job ${job.id}`);
    }
  }
}
