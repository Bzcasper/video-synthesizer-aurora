
import React from 'react';
import TrimVideoControl from './TrimVideoControl';
import FilterVideoControl from './FilterVideoControl';
import SpeedVideoControl from './SpeedVideoControl';
import SubtitleVideoControl from './SubtitleVideoControl';
import { Card } from "@/components/ui/card";

interface EditingControlsPanelProps {
  videoId: string;
  onEditSubmit: (editData: {
    type: 'trim' | 'filter' | 'speed' | 'subtitle';
    params: Record<string, any>;
  }) => void;
}

const EditingControlsPanel: React.FC<EditingControlsPanelProps> = ({
  videoId,
  onEditSubmit,
}) => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Trim Video</h3>
        <TrimVideoControl
          videoId={videoId}
          onSubmit={(params) => onEditSubmit({ type: 'trim', params })}
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Apply Filter</h3>
        <FilterVideoControl
          videoId={videoId}
          onSubmit={(params) => onEditSubmit({ type: 'filter', params })}
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Adjust Speed</h3>
        <SpeedVideoControl
          videoId={videoId}
          onSubmit={(params) => onEditSubmit({ type: 'speed', params })}
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Add Subtitles</h3>
        <SubtitleVideoControl
          videoId={videoId}
          onSubmit={(params) => onEditSubmit({ type: 'subtitle', params })}
        />
      </Card>
    </div>
  );
};

export default EditingControlsPanel;

