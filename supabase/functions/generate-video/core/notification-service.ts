
import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logging';

export interface NotificationPayload {
  userId: string;
  jobId: string;
  type: 'completion' | 'failure' | 'progress';
  message: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  constructor(private supabase: ReturnType<typeof createClient>) {}

  async sendNotification(notification: NotificationPayload): Promise<void> {
    try {
      // Store notification in database
      const { error: dbError } = await this.supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          job_id: notification.jobId,
          type: notification.type,
          message: notification.message,
          metadata: notification.metadata,
          created_at: new Date().toISOString(),
          read: false
        });

      if (dbError) {
        throw dbError;
      }

      // If we have a client-provided callback URL in metadata, call it
      if (notification.metadata?.callbackUrl) {
        try {
          await fetch(notification.metadata.callbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobId: notification.jobId,
              type: notification.type,
              message: notification.message
            })
          });
        } catch (error) {
          logger.error(`Failed to call callback URL for job ${notification.jobId}:`, error);
        }
      }

      // Log the notification
      logger.info(`Sent notification for job ${notification.jobId}:`, notification);
    } catch (error) {
      logger.error(`Error sending notification for job ${notification.jobId}:`, error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  async getUserNotifications(
    userId: string,
    options: { limit?: number; offset?: number; unreadOnly?: boolean } = {}
  ): Promise<any[]> {
    try {
      let query = this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options.unreadOnly) {
        query = query.eq('read', false);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error(`Error fetching notifications for user ${userId}:`, error);
      throw error;
    }
  }
}
