import { logger } from "../utils/logging";
import { VideoJob, VideoGenerationResult } from "./types";
import { FrameGenerator } from "./frame-generator";
import { FrameEnhancer } from "./frame-enhancer";
import { VideoAssembler } from "./video-assembler";
import { JobStatusManager } from "./job-status-manager";
import { ErrorHandler } from "./errorhandler";

export class JobProcessor {
  constructor(
    private frameGenerator: FrameGenerator,
    private frameEnhancer: FrameEnhancer,
    private videoAssembler: VideoAssembler,
    private jobStatusManager: JobStatusManager,
    private errorHandler: ErrorHandler,
  ) {}

  async processJob(job: VideoJob): Promise<VideoGenerationResult> {
    logger.info(`Processing job ${job.id}`);

    try {
      // Update job status to processing
      await this.jobStatusManager.updateJobStatus(job.id, "processing");

      // Generate initial frames
      const frames = await this.frameGenerator.generateFrames(job);

      // Update progress
      await this.jobStatusManager.updateJobProgress(job.id, 33);

      // Enhance frames if requested
      let processedFrames = frames;
      if (job.settings.enhance_frames) {
        processedFrames = await this.frameEnhancer.enhanceFrames(
          frames,
          job.id,
        );
      }

      // Update progress
      await this.jobStatusManager.updateJobProgress(job.id, 66);

      // Assemble final video
      const result = await this.videoAssembler.assembleVideo(
        processedFrames,
        job,
      );

      // Update progress
      await this.jobStatusManager.updateJobProgress(job.id, 100);

      return result;
    } catch (error) {
      logger.error(`Error processing job ${job.id}:`, error);

      // Update job status to failed
      await this.jobStatusManager.updateJobFailure(
        job.id,
        error instanceof Error ? error.message : "Unknown error",
      );

      throw this.errorHandler.wrapError(
        error,
        `Failed to process job ${job.id}`,
      );
    }
  }
}
