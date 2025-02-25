
import { VideoJobManager, type VideoOptions } from '@/lib/video/VideoJobManager';
import { supabase } from "@/integrations/supabase/client";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, options } = req.body;
    const { user } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const videoManager = new VideoJobManager();
    const job = await videoManager.createJob(user.id, prompt, options);

    // Trigger Modal Labs API call (implementation in edge function)
    await supabase.functions.invoke('generate-video', {
      body: { jobId: job.id, prompt, options }
    });

    return res.status(200).json(job);
  } catch (error) {
    console.error('Error in generate video endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
