
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');

    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get job status
    const { data: job, error } = await supabase
      .from('video_jobs')
      .select(`
        *,
        job_assets (*)
      `)
      .eq('id', jobId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch job status: ${error.message}`);
    }

    if (!job) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    return new Response(
      JSON.stringify({
        id: job.id,
        status: job.status,
        output_url: job.output_url,
        error_message: job.error_message,
        created_at: job.created_at,
        processing_started_at: job.processing_started_at,
        processing_completed_at: job.processing_completed_at,
        assets: job.job_assets,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
