
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoGenerationRequest {
  prompt: string;
  duration: number;
  resolution: { width: number; height: number };
  style?: string;
  webhookUrl?: string;
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

    // Get user ID from request if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const { data: { user }, error } = await supabase.auth.getUser(authHeader.split(' ')[1]);
      if (!error && user) {
        userId = user.id;
      }
    }

    // Parse and validate request body
    const { prompt, duration, resolution, style, webhookUrl }: VideoGenerationRequest = await req.json();

    if (!prompt || !duration || !resolution) {
      throw new Error('Missing required parameters');
    }

    // Create a new job in the database
    const { data: job, error: jobError } = await supabase
      .from('video_jobs')
      .insert({
        prompt,
        duration,
        resolution,
        style,
        webhook_url: webhookUrl,
        user_id: userId,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) {
      throw new Error(`Failed to create job: ${jobError.message}`);
    }

    // Trigger Modal Labs video generation (you'll need to implement this part)
    const modalApiUrl = Deno.env.get('MODAL_API_URL')!;
    const modalApiKey = Deno.env.get('MODAL_API_KEY')!;

    const modalResponse = await fetch(`${modalApiUrl}/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${modalApiKey}`,
      },
      body: JSON.stringify({
        jobId: job.id,
        prompt,
        duration,
        resolution,
        style,
        webhookUrl,
      }),
    });

    if (!modalResponse.ok) {
      // If Modal request fails, update job status to failed
      await supabase
        .from('video_jobs')
        .update({ 
          status: 'failed',
          error_message: 'Failed to start video generation process',
          updated_at: new Date().toISOString(),
        })
        .eq('id', job.id);

      throw new Error('Failed to start video generation process');
    }

    // Update job status to processing
    await supabase
      .from('video_jobs')
      .update({ 
        status: 'processing',
        processing_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    // Return the job ID and status
    return new Response(
      JSON.stringify({
        jobId: job.id,
        status: 'processing',
        message: 'Video generation started successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 202,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
