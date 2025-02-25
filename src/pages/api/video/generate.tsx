
import { supabase } from "@/integrations/supabase/client";
import { VideoJobManager } from "@/lib/video/VideoJobManager";

export async function POST(req: Request) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { prompt, duration, resolution } = await req.json();
    
    const task = await VideoJobManager.createVideoJob(
      session.user.id,
      prompt,
      duration,
      resolution
    );

    return new Response(JSON.stringify(task), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
