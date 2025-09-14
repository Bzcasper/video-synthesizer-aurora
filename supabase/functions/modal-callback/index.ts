import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ModalCallback {
  jobId: string;
  status: "completed" | "failed";
  outputUrl?: string;
  errorMessage?: string;
  assets?: Array<{
    type: string;
    url: string;
    metadata?: Record<string, any>;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { jobId, status, outputUrl, errorMessage, assets }: ModalCallback =
      await req.json();

    if (!jobId || !status) {
      throw new Error("Missing required parameters");
    }

    // Get the current job to check webhook_url
    const { data: job, error: jobError } = await supabase
      .from("video_jobs")
      .select("webhook_url")
      .eq("id", jobId)
      .single();

    if (jobError) {
      throw new Error(`Failed to fetch job: ${jobError.message}`);
    }

    // Update job status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
      processing_completed_at: new Date().toISOString(),
    };

    if (status === "completed" && outputUrl) {
      updateData.output_url = outputUrl;
    } else if (status === "failed" && errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { error: updateError } = await supabase
      .from("video_jobs")
      .update(updateData)
      .eq("id", jobId);

    if (updateError) {
      throw new Error(`Failed to update job: ${updateError.message}`);
    }

    // Insert assets if provided
    if (assets && assets.length > 0) {
      const { error: assetsError } = await supabase.from("job_assets").insert(
        assets.map((asset) => ({
          job_id: jobId,
          type: asset.type,
          url: asset.url,
          metadata: asset.metadata,
        })),
      );

      if (assetsError) {
        console.error("Failed to insert assets:", assetsError);
      }
    }

    // Send webhook if URL is provided
    if (job.webhook_url) {
      try {
        await fetch(job.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId,
            status,
            outputUrl,
            errorMessage,
            assets,
          }),
        });
      } catch (webhookError) {
        console.error("Webhook delivery failed:", webhookError);
      }
    }

    return new Response(
      JSON.stringify({ message: "Callback processed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
