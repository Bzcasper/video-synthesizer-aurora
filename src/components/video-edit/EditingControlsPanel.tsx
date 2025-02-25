
import React from 'react';
import { Card } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";

type VideoJob = Database["public"]["Tables"]["video_jobs"]["Row"];

interface EditingControlsPanelProps {
  video: VideoJob;
}

const EditingControlsPanel = ({ video }: EditingControlsPanelProps) => {
  return (
    <Card className="glass-panel p-6 space-y-6">
      <h2 className="text-2xl font-orbitron text-gradient bg-gradient-glow">
        Editing Controls
      </h2>
      <div className="space-y-4">
        {/* Edit control sections will be added here */}
        <p className="text-gray-400">
          Editing controls will be implemented in the next steps.
        </p>
      </div>
    </Card>
  );
};

export default EditingControlsPanel;
