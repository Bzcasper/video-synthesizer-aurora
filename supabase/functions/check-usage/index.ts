
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase environment variables are not set');
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get the request body
    const { userId, action } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the current month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
    
    if (action === 'check') {
      // Get usage stats for current month
      const { data: usageData, error: usageError } = await supabase
        .from('monthly_usage')
        .select('video_count')
        .eq('user_id', userId)
        .eq('month', firstDayOfMonth)
        .single();
      
      // Get user's subscription
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      let videoUsage = 0;
      if (!usageError && usageData) {
        videoUsage = usageData.video_count;
      }
      
      let subscriptionTier = 'free';
      if (!subError && subData) {
        subscriptionTier = subData.tier;
      }
      
      // Calculate limits based on tier
      const limits = {
        videoLimit: subscriptionTier === 'free' ? 5 : Infinity,
        maxResolution: subscriptionTier === 'free' ? '720p' : '4K',
        processingPriority: subscriptionTier === 'free' ? 'normal' : 'high',
        canAccessPremiumStyles: subscriptionTier !== 'free',
      };
      
      return new Response(
        JSON.stringify({
          usage: {
            videos: videoUsage,
          },
          subscription: {
            tier: subscriptionTier,
          },
          limits: limits,
          remainingVideos: limits.videoLimit === Infinity ? null : limits.videoLimit - videoUsage,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (action === 'increment') {
      // Get current usage
      const { data: usageData, error: usageError } = await supabase
        .from('monthly_usage')
        .select('id, video_count')
        .eq('user_id', userId)
        .eq('month', firstDayOfMonth)
        .single();
      
      if (usageError && usageError.code === 'PGRST116') {
        // Record doesn't exist, create it
        const { data: newUsage, error: insertError } = await supabase
          .from('monthly_usage')
          .insert({
            user_id: userId,
            month: firstDayOfMonth,
            video_count: 1,
          })
          .select();
        
        if (insertError) {
          throw insertError;
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            usage: {
              videos: 1,
            }
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else if (usageError) {
        throw usageError;
      }
      
      // Increment the usage count
      const { data: updatedUsage, error: updateError } = await supabase
        .from('monthly_usage')
        .update({
          video_count: usageData.video_count + 1,
        })
        .eq('id', usageData.id)
        .select();
      
      if (updateError) {
        throw updateError;
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          usage: {
            videos: updatedUsage[0].video_count,
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in check-usage function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
