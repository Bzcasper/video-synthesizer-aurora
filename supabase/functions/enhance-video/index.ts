
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EnhancementRequest {
  video_id: string;
  enhancement_type: 'upscale' | 'frame_interpolation' | 'filter' | 'speed_adjustment' | 'subtitle_overlay' | 'lip_sync';
  filter_type?: 'cinematic' | 'anime' | 'vintage' | 'bw';
  target_resolution?: '1080p' | '4K';
  speed_factor?: number;
  subtitle_file?: string;
  callback_url?: string;
}

const validateRequest = (data: any): data is EnhancementRequest => {
  const validEnhancementTypes = ['upscale', 'frame_interpolation', 'filter', 'speed_adjustment', 'subtitle_overlay', 'lip_sync'];
  const validFilterTypes = ['cinematic', 'anime', 'vintage', 'bw'];
  const validResolutions = ['1080p', '4K'];

  if (!data.video_id || !data.enhancement_type) {
    throw new Error('Missing required fields: video_id and enhancement_type');
  }

  if (!validEnhancementTypes.includes(data.enhancement_type)) {
    throw new Error('Invalid enhancement_type');
  }

  if (data.enhancement_type === 'filter' && data.filter_type && !validFilterTypes.includes(data.filter_type)) {
    throw new Error('Invalid filter_type');
  }

  if (data.enhancement_type === 'upscale' && data.target_resolution && !validResolutions.includes(data.target_resolution)) {
    throw new Error('Invalid target_resolution');
  }

  if (data.enhancement_type === 'speed_adjustment' && data.speed_factor && (data.speed_factor < 0.1 || data.speed_factor > 4.0)) {
    throw new Error('Speed factor must be between 0.1 and 4.0');
  }

  return true;
};

const checkUserSubscription = async (userId: string): Promise<boolean> => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error checking subscription:', error);
    return false;
  }

  return subscription?.tier === 'pro';
};

const createEnhancementJob = async (
  userId: string,
  request: EnhancementRequest,
  isPro: boolean,
): Promise<string> => {
  const { data, error } = await supabase
    .from('video_enhancements')
    .insert({
      video_id: request.video_id,
      user_id: userId,
      enhancement_type: request.enhancement_type,
      filter_type: request.filter_type,
      target_resolution: request.target_resolution,
      speed_factor: request.speed_factor,
      subtitle_file: request.subtitle_file,
      callback_url: request.callback_url,
      status: 'pending',
      priority: isPro ? 'high' : 'low'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating enhancement job:', error);
    throw new Error('Failed to create enhancement job');
  }

  // Trigger n8n webhook for processing
  if (request.callback_url) {
    try {
      await fetch(request.callback_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: data.id,
          video_id: request.video_id,
          enhancement_type: request.enhancement_type,
        }),
      });
    } catch (error) {
      console.error('Error triggering webhook:', error);
      // Don't throw here, as the job is already created
    }
  }

  return data.id;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the JWT from the request header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Parse and validate the request
    const requestData = await req.json();
    if (!validateRequest(requestData)) {
      throw new Error('Invalid request data');
    }

    // Check subscription status
    const isPro = await checkUserSubscription(user.id);

    // Free tier limitations
    if (!isPro) {
      // Check monthly usage
      const { count } = await supabase
        .from('video_enhancements')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', new Date(new Date().setDate(1)).toISOString())
        .single();

      if (count && count >= 5) {
        throw new Error('Free tier limit reached. Please upgrade to Pro for unlimited enhancements.');
      }

      // Restrict certain features for free tier
      if (['upscale', 'frame_interpolation'].includes(requestData.enhancement_type)) {
        throw new Error('This enhancement type is only available for Pro users');
      }
    }

    // Create the enhancement job
    const jobId = await createEnhancementJob(user.id, requestData, isPro);

    // Return the response
    const response = {
      job_id: jobId,
      status: 'processing',
      estimated_completion: `${isPro ? '3' : '5'} minutes`,
      enhanced_video_url: null,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing enhancement request:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
