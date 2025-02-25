// supabase/functions/generate-video/utils/webhooks.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { WEBHOOK_EVENTS } from '../config/constants';
import { logger } from './logging';

/**
 * Interface for webhook payload
 */
export interface WebhookPayload {
  event: string;
  jobId: string;
  userId: string;
  progress?: number;
  stage?: string;
  message?: string;
  timestamp: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

/**
 * Utility class for sending webhook notifications
 */
export class WebhookHandler {
  private supabase: ReturnType<typeof createClient>;

  constructor(supabaseClient: ReturnType<typeof createClient>) {
    this.supabase = supabaseClient;
  }

  /**
   * Send webhook notification for a job event
   */
  async sendWebhook(
    jobId: string,
    event: string,
    payload: Partial<WebhookPayload>
  ): Promise<boolean> {
    try {
      // Get job details to check if there's a callback URL
      const { data: job, error } = await this.supabase
        .from('video_jobs')
        .select('id, user_id, callback_url')
        .eq('id', jobId)
        .single();
      
      if (error || !job || !job.callback_url) {
        return false; // No callback URL or error fetching job
      }

      // Create webhook payload
      const webhookPayload: WebhookPayload = {
        event,
        jobId,
        userId: job.user_id,
        timestamp: new Date().toISOString(),
        ...payload
      };

      // Send webhook
      const response = await fetch(job.callback_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        logger.warn(`Webhook delivery failed for job ${jobId}, status: ${response.status}`);
        return false;
      }

      logger.debug(`Webhook delivered for job ${jobId}, event: ${event}`);
      return true;
    } catch (error) {
      logger.error(`Error sending webhook for job ${jobId}:`, error);
      return false;
    }
  }

  /**
   * Send job created webhook
   */
  async sendJobCreatedWebhook(jobId: string, userId: string): Promise<boolean> {
    return this.sendWebhook(jobId, WEBHOOK_EVENTS.JOB_CREATED, { userId });
  }

  /**
   * Send job started webhook
   */
  async sendJobStartedWebhook(jobId: string): Promise<boolean> {
    return this.sendWebhook(jobId, WEBHOOK_EVENTS.JOB_STARTED, {});
  }

  /**
   * Send job progress webhook
   */
  async sendJobProgressWebhook(
    jobId: string,
    progress: number,
    stage: string,
    message: string
  ): Promise<boolean> {
    return this.sendWebhook(jobId, WEBHOOK_EVENTS.JOB_PROGRESS, {
      progress,
      stage,
      message
    });
  }

  /**
   * Send job completed webhook
   */
  async sendJobCompletedWebhook(
    jobId: string,
    videoUrl: string,
    thumbnailUrl: string
  ): Promise<boolean> {
    return this.sendWebhook(jobId, WEBHOOK_EVENTS.JOB_COMPLETED, {
      videoUrl,
      thumbnailUrl
    });
  }

  /**
   * Send job failed webhook
   */
  async sendJobFailedWebhook(jobId: string, error: string): Promise<boolean> {
    return this.sendWebhook(jobId, WEBHOOK_EVENTS.JOB_FAILED, { error });
  }
}