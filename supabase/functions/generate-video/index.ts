
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoGenerationRequest {
  prompt: string;
  duration: number;
  style?: string;
  resolution?: { width: number; height: number };
  webhook_url?: string;
  enhance_frames?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse and validate request
    const {
      prompt,
      duration,
      style = 'cinematic',
      resolution = { width: 1920, height: 1080 },
      webhook_url,
      enhance_frames = false
    }: VideoGenerationRequest = await req.json();

    if (!prompt || !duration) {
      throw new Error('Missing required parameters');
    }

    // Check monthly usage limits for free tier users
    const { data: usageData, error: usageError } = await supabase
      .rpc('check_free_tier_limits', { user_id: user.id });

    if (usageError) {
      console.error('Error checking usage limits:', usageError);
      throw new Error('Failed to check usage limits');
    }

    if (usageData) {
      throw new Error('Monthly limit exceeded. Please upgrade your plan.');
    }

    // Create video job record
    const { data: jobData, error: jobError } = await supabase
      .from('video_jobs')
      .insert({
        user_id: user.id,
        prompt,
        duration,
        style,
        resolution,
        webhook_url,
        enhance_frames,
        status: 'pending',
        metadata: {
          source: 'web_app',
          browser: req.headers.get('user-agent'),
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      throw new Error('Failed to create video job');
    }

    // Start async video processing
    EdgeRuntime.waitUntil(processVideoJob(jobData.id, supabase));

    // Return success response with job ID
    return new Response(
      JSON.stringify({
        message: 'Video generation started',
        job_id: jobData.id,
        status: 'pending'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 202
      }
    );

  } catch (error) {
    console.error('Error in generate-video function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 500
      }
    );
  }
});

// Background task to process the video
async function processVideoJob(jobId: string, supabase: any) {
  try {
    // Update job to processing status
    await supabase
      .from('video_jobs')
      .update({
        status: 'processing',
        processing_started_at: new Date().toISOString()
      })
      .eq('id', jobId);

    // Simulate video processing (replace with actual AI video generation)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Update job to completed status
    const { error: updateError } = await supabase
      .from('video_jobs')
      .update({
        status: 'completed',
        processing_completed_at: new Date().toISOString(),
        output_url: `https://example.com/videos/${jobId}.mp4`, // Replace with actual URL
        processing_time: 5, // Replace with actual processing time
      })
      .eq('id', jobId);

    if (updateError) {
      throw updateError;
    }

  } catch (error) {
    console.error('Error processing video job:', error);
    
    // Update job with error status
    await supabase
      .from('video_jobs')
      .update({
        status: 'failed',
        error_message: error.message,
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }
}
