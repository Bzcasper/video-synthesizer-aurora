// supabase/functions/generate-social-video/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// Create a Supabase client for the database operations
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

interface VideoOptions {
  voiceStyle: string;
  visualStyle: string;
  musicType: string;
  duration: number;
  includeIntro: boolean;
  includeCaptions: boolean;
}

interface VideoRequest {
  content: string[];
  platforms: string[];
  options: VideoOptions;
  userId?: string;
}

// Main function to generate social media videos
async function generateSocialVideos(request: VideoRequest) {
  try {
    const { content, platforms, options, userId } = request;

    if (!content || content.length === 0) {
      throw new Error("Content sections are required");
    }

    if (!platforms || platforms.length === 0) {
      throw new Error("At least one platform must be selected");
    }

    // For each platform, add a video generation job to the queue
    const videoJobs = [];
    for (const platform of platforms) {
      // Create an entry in the video_jobs table
      const { data: job, error } = await supabaseClient
        .from("video_jobs")
        .insert({
          user_id: userId,
          prompt: `Social media video for ${platform}: ${content[0].substring(0, 50)}...`,
          status: "pending",
          metadata: {
            platform,
            content,
            options,
            source: "blog-to-video",
          },
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating job for ${platform}:`, error);
        throw error;
      }

      videoJobs.push(job);

      // In a real application, this would trigger processing through a queue
      // For this example, we'll just simulate that the jobs were created
    }

    return {
      message: `Created ${videoJobs.length} video generation jobs`,
      jobs: videoJobs.map((job) => ({
        id: job.id,
        platform: job.metadata.platform,
        status: job.status,
      })),
    };
  } catch (error) {
    console.error("Error generating social videos:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the user ID from the auth context
    const {
      data: { session },
      error: authError,
    } = await supabaseClient.auth.getSession();

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Authentication error" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request
    const request = await req.json();

    // Add user ID to the request if authenticated
    if (session?.user?.id) {
      request.userId = session.user.id;
    }

    // Generate social media videos
    const result = await generateSocialVideos(request);

    // Return result
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-social-video function:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate social videos",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
