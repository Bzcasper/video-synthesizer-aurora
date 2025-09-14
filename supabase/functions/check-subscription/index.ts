import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables are not set");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the request body
    const { userId, requestType } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the user's current subscription
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("tier, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    let subscriptionTier = "free";
    let isSubscriptionActive = true;

    if (!subscriptionError && subscriptionData) {
      subscriptionTier = subscriptionData.tier;
      isSubscriptionActive = subscriptionData.status === "active";
    }

    // Check if the user has reached free tier limits
    if (subscriptionTier === "free") {
      // Get current month usage
      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      )
        .toISOString()
        .split("T")[0];

      const { data: usageData, error: usageError } = await supabase
        .from("monthly_usage")
        .select("video_count")
        .eq("user_id", userId)
        .eq("month", firstDayOfMonth)
        .single();

      let currentUsage = 0;
      if (!usageError && usageData) {
        currentUsage = usageData.video_count;
      }

      // Check different request types and their limits
      if (requestType === "generate_video") {
        // Free tier limit: 5 videos per month
        if (currentUsage >= 5) {
          return new Response(
            JSON.stringify({
              allowed: false,
              reason: "monthly_limit_reached",
              limit: 5,
              usage: currentUsage,
              subscription: {
                tier: subscriptionTier,
                active: isSubscriptionActive,
              },
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      } else if (requestType === "high_resolution") {
        // Free tier can only use 720p
        return new Response(
          JSON.stringify({
            allowed: false,
            reason: "feature_not_available",
            subscription: {
              tier: subscriptionTier,
              active: isSubscriptionActive,
            },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } else if (requestType === "premium_style") {
        // Free tier cannot use premium styles
        return new Response(
          JSON.stringify({
            allowed: false,
            reason: "feature_not_available",
            subscription: {
              tier: subscriptionTier,
              active: isSubscriptionActive,
            },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // User has permission (either within free limits or on paid tier)
    return new Response(
      JSON.stringify({
        allowed: true,
        subscription: {
          tier: subscriptionTier,
          active: isSubscriptionActive,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in check-subscription function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
