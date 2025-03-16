
// supabase/functions/generate-video/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../_shared/cors.ts';
import { VideoGenerator } from './core/video-generator.ts';
import { AssetManager } from './core/AssetManager.ts';
import { QueueManager } from './core/queuemanager.ts';
import { ProgressTracker } from './core/progresstracker.ts';
import { ErrorHandler } from './core/errorhandler.ts';
import { validateRequest, normalizeSettings, VideoGenerationRequest } from './config/validation.ts';
import { logger } from './utils/logging.ts';
import { StorageUtils } from './utils/storage.ts';
import { SYSTEM } from './config/constants.ts';

// Create a single Supabase client for the function
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize core components
const errorHandler = new ErrorHandler(supabaseClient);
const progressTracker = new ProgressTracker(supabaseClient, errorHandler);
const assetManager = new AssetManager(supabaseClient, errorHandler);
const videoGenerator = new VideoGenerator(supabaseClient, errorHandler, progressTracker);
const queueManager = new QueueManager(supabaseClient, videoGenerator, errorHandler);
const storageUtils = new StorageUtils(supabaseClient, errorHandler);

// Ensure required storage buckets exist on startup
await storageUtils.ensureBucketExists(SYSTEM.STORAGE.BUCKET);

/**
 * Main edge function handler
 */
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { method, url } = req;
    const requestUrl = new URL(url);
    const path = requestUrl.pathname.split('/').pop();
    
    // Add CORS headers to all responses
    const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
    
    // Basic authentication (should be enhanced in production)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authentication' }),
        { status: 401, headers }
      );
    }
    
    // Main route handling
    if (method === 'POST') {
      // Parse request body
      const requestBody = await req.json();
      
      // Handle video generation requests
      if (path === 'generate') {
        return await handleGenerateRequest(requestBody, headers);
      }
      
      // Handle job cancellation
      if (path === 'cancel') {
        return await handleCancelRequest(requestBody, headers);
      }
      
      // Handle job retry/restart
      if (path === 'restart') {
        return await handleRestartRequest(requestBody, headers);
      }
    } 
    else if (method === 'GET') {
      // Handle status requests
      if (path === 'status') {
        const jobId = requestUrl.searchParams.get('jobId');
        
        if (!jobId) {
          return new Response(
            JSON.stringify({ error: 'Missing job ID' }),
            { status: 400, headers }
          );
        }
        
        return await handleStatusRequest(jobId, headers);
      }
      
      // Handle queue stats requests
      if (path === 'queue-stats') {
        return await handleQueueStatsRequest(headers);
      }
    }
    
    // If no route matched
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers }
    );
  } catch (error) {
    // Log internal errors
    logger.error('Unhandled error in edge function:', error);
    
    // Send generic error response
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});

/**
 * Handle video generation request
 * @param requestBody Request body
 * @param headers Response headers
 * @returns Response object
 */
async function handleGenerateRequest(requestBody: any, headers: HeadersInit): Promise<Response> {
  try {
    // Validate request
    const request = validateRequest(requestBody as VideoGenerationRequest);
    
    // Normalize settings
    request.settings = normalizeSettings(request.settings, request.userTier);
    
    // Add job to queue
    const jobId = await queueManager.addJob({
      userId: request.userId,
      prompt: request.prompt,
      settings: request.settings,
    });
    
    // Return job ID
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video generation job added to queue',
        jobId
      }),
      { status: 200, headers }
    );
  } catch (error) {
    logger.error('Error handling generate request:', error);
    
    // Determine status code based on error
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to generate video',
      }),
      { status: statusCode, headers }
    );
  }
}

/**
 * Handle job cancellation request
 * @param requestBody Request body
 * @param headers Response headers
 * @returns Response object
 */
async function handleCancelRequest(requestBody: any, headers: HeadersInit): Promise<Response> {
  try {
    const { jobId } = requestBody;
    
    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Missing job ID' }),
        { status: 400, headers }
      );
    }
    
    // Cancel job
    const success = await queueManager.cancelJob(jobId);
    
    if (success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Job cancelled successfully'
        }),
        { status: 200, headers }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Job could not be cancelled. It may already be processing or completed.'
        }),
        { status: 409, headers }
      );
    }
  } catch (error) {
    logger.error('Error handling cancel request:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to cancel job',
      }),
      { status: 500, headers }
    );
  }
}

/**
 * Handle job restart request
 * @param requestBody Request body
 * @param headers Response headers
 * @returns Response object
 */
async function handleRestartRequest(requestBody: any, headers: HeadersInit): Promise<Response> {
  try {
    const { jobId } = requestBody;
    
    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Missing job ID' }),
        { status: 400, headers }
      );
    }
    
    // Restart job
    const success = await queueManager.restartJob(jobId);
    
    if (success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Job restarted successfully'
        }),
        { status: 200, headers }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Job could not be restarted. It may not be in a failed state.'
        }),
        { status: 409, headers }
      );
    }
  } catch (error) {
    logger.error('Error handling restart request:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to restart job',
      }),
      { status: 500, headers }
    );
  }
}

/**
 * Handle job status request
 * @param jobId Job ID
 * @param headers Response headers
 * @returns Response object
 */
async function handleStatusRequest(jobId: string, headers: HeadersInit): Promise<Response> {
  try {
    // Get job progress
    const progressData = await progressTracker.getJobProgress(jobId);
    
    // Get job details
    const { data: job, error } = await supabaseClient
      .from('video_jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!job) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers }
      );
    }
    
    // Calculate estimated time remaining
    let estimatedTimeRemaining = null;
    
    if (job.status === 'processing' && job.started_at) {
      estimatedTimeRemaining = await progressTracker.estimateTimeRemaining(
        jobId,
        progressData.progress,
        new Date(job.started_at)
      );
    }
    
    // Return job status information
    return new Response(
      JSON.stringify({
        jobId,
        status: job.status,
        progress: progressData.progress,
        stage: progressData.stage,
        error: job.error,
        createdAt: job.created_at,
        startedAt: job.started_at,
        completedAt: job.completed_at,
        outputUrl: job.output_url,
        thumbnailUrl: job.thumbnail_url,
        estimatedTimeRemaining
      }),
      { status: 200, headers }
    );
  } catch (error) {
    logger.error(`Error handling status request for job ${jobId}:`, error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to get job status',
      }),
      { status: 500, headers }
    );
  }
}

/**
 * Handle queue stats request
 * @param headers Response headers
 * @returns Response object
 */
async function handleQueueStatsRequest(headers: HeadersInit): Promise<Response> {
  try {
    // Get queue stats
    const stats = await queueManager.getQueueStats();
    
    // Return queue stats
    return new Response(
      JSON.stringify({
        stats,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers }
    );
  } catch (error) {
    logger.error('Error handling queue stats request:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to get queue stats',
      }),
      { status: 500, headers }
    );
  }
}
