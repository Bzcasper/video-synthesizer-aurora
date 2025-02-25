
import { VideoEditor } from '@/lib/video/VideoEditor';
import { supabase } from "@/integrations/supabase/client";
import { type Database } from "@/integrations/supabase/types";

type FilterType = Database["public"]["Enums"]["video_filter_type"];

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoId, operation, parameters } = req.body;
    const { user } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const videoEditor = new VideoEditor();
    let edit;

    switch (operation) {
      case 'trim':
        edit = await videoEditor.applyTrim(videoId, user.id, parameters.start, parameters.end);
        break;
      case 'filter':
        edit = await videoEditor.applyFilter(videoId, user.id, parameters.filter as FilterType);
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

    // Trigger processing in edge function
    await supabase.functions.invoke('process-video-edit', {
      body: { editId: edit.id, operation, parameters }
    });

    return res.status(200).json(edit);
  } catch (error) {
    console.error('Error in video edit endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
