
import { logger } from '../utils/logging';
import { VideoGenerationRequest } from '../config/validation';

export class FileValidator {
  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  private readonly allowedAudioTypes = [
    'audio/mpeg',
    'audio/wav',
    'audio/mp3'
  ];

  constructor() {}

  async validateGenerationInput(request: VideoGenerationRequest): Promise<void> {
    logger.info('Validating video generation input');

    // Validate image files if provided
    if (request.images?.length) {
      for (const image of request.images) {
        await this.validateImage(image);
      }
    }

    // Validate audio file if provided
    if (request.audioFile) {
      await this.validateAudio(request.audioFile);
    }
  }

  private async validateImage(imageData: string | File): Promise<void> {
    if (imageData instanceof File) {
      if (!this.allowedImageTypes.includes(imageData.type)) {
        throw new Error(`Invalid image type: ${imageData.type}`);
      }
      
      if (imageData.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Image file too large (max 10MB)');
      }
    } else if (typeof imageData === 'string') {
      if (!imageData.startsWith('data:image/') && !imageData.startsWith('http')) {
        throw new Error('Invalid image data format');
      }
    } else {
      throw new Error('Invalid image data type');
    }
  }

  private async validateAudio(audioData: string | File): Promise<void> {
    if (audioData instanceof File) {
      if (!this.allowedAudioTypes.includes(audioData.type)) {
        throw new Error(`Invalid audio type: ${audioData.type}`);
      }
      
      if (audioData.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('Audio file too large (max 50MB)');
      }
    } else if (typeof audioData === 'string') {
      if (!audioData.startsWith('data:audio/') && !audioData.startsWith('http')) {
        throw new Error('Invalid audio data format');
      }
    } else {
      throw new Error('Invalid audio data type');
    }
  }
}
