// supabase/functions/generate-video/utils/auth-middleware.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { logger } from './logging';

/**
 * Interface for authenticated request information
 */
export interface AuthResult {
  isAuthenticated: boolean;
  userId?: string;
  userTier?: 'free' | 'pro';
  error?: string;
}

/**
 * Middleware for authenticating API requests
 */
export class AuthMiddleware {
  private supabase: ReturnType<typeof createClient>;

  constructor(supabaseClient: ReturnType<typeof createClient>) {
    this.supabase = supabaseClient;
  }

  /**
   * Authenticate a request using the Authorization header
   */
  async authenticateRequest(request: Request): Promise<AuthResult> {
    try {
      // Get authorization header
      const authHeader = request.headers.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          isAuthenticated: false,
          error: 'Missing or invalid authorization header',
        };
      }

      // Extract token
      const token = authHeader.split(' ')[1];

      if (!token) {
        return {
          isAuthenticated: false,
          error: 'Missing token in authorization header',
        };
      }

      // Verify token
      const { data: { user }, error } = await this.supabase.auth.getUser(token);

      if (error || !user) {
        return {
          isAuthenticated: false,
          error: error ? error.message : 'Invalid token',
        };
      }

      // Get user tier from metadata
      const userTier = (user.app_metadata?.tier as 'free' | 'pro') || 'free';

      return {
        isAuthenticated: true,
        userId: user.id,
        userTier,
      };
    } catch (error) {
      logger.error('Error authenticating request:', error);
      return {
        isAuthenticated: false,
        error: 'Authentication error',
      };
    }
  }
}