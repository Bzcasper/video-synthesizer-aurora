
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import TrimVideoControl from './TrimVideoControl';
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type VideoJob = Database["public"]["Tables"]["video_jobs"]["Row"];

interface EditingControlsPanelProps {
  video: VideoJob;
}

const EditingControlsPanel = ({ video }: EditingControlsPanelProps) => {
  const handleTrimApply = async (startTime: number, endTime: number) => {
    const { data, error } = await supabase
      .from('video_edits')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        original_video_id: video.id,
        operation: 'trim',
        parameters: {
          start_time: startTime,
          end_time: endTime
        },
        status: 'pending'
      });

    if (error) throw error;
    return data;
  };

  return (
    <Card className="glass-panel space-y-6">
      <h2 className="text-2xl font-orbitron text-gradient bg-gradient-glow p-6 border-b border-white/10">
        Editing Controls
      </h2>
      <div className="p-6 space-y-6">
        <TrimVideoControl
          video={video}
          duration={video.duration}
          startTime={0}
          endTime={video.duration}
          onStartTimeChange={(time) => {}}
          onEndTimeChange={(time) => {}}
          onApplyTrim={async () => {}}
        />
      </div>
    </Card>
  );
};

export default EditingControlsPanel;
