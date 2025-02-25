
import { supabase } from "@/integrations/supabase/client";
import { VideoEditor } from "@/lib/video/VideoEditor";
import { VideoEditOperation } from "@/types/video";

export async function POST(req: Request) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { videoId, operation, parameters } = await req.json();
    
    const task = await VideoEditor.submitEdit(
      videoId,
      session.user.id,
      operation as VideoEditOperation,
      parameters
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
