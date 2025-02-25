
import { VideoJobManager } from '@/lib/video/VideoJobManager';
import { supabase } from "@/integrations/supabase/client";

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobId } = req.query;
    const { user } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const videoManager = new VideoJobManager();
    const status = await videoManager.checkJobStatus(jobId);

    return res.status(200).json(status);
  } catch (error) {
    console.error('Error in check status endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
