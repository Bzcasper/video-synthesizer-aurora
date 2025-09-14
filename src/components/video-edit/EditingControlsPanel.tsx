import React, { useState } from "react";
import TrimVideoControl from "./TrimVideoControl";
import FilterVideoControl from "./FilterVideoControl";
import SpeedVideoControl from "./SpeedVideoControl";
import SubtitleVideoControl from "./SubtitleVideoControl";
import { Card } from "@/components/ui/card";

interface EditingControlsPanelProps {
  videoId: string;
  onEditSubmit: (editData: {
    type: "trim" | "filter" | "speed" | "subtitle";
    params: Record<string, any>;
  }) => void;
}

const EditingControlsPanel: React.FC<EditingControlsPanelProps> = ({
  videoId,
  onEditSubmit,
}) => {
  // State for TrimVideoControl
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(60); // Default duration of 60 seconds
  const duration = 60; // This should ideally come from the video metadata

  // State for FilterVideoControl
  const [currentFilter, setCurrentFilter] = useState("none");
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">Trim Video</h3>
        <TrimVideoControl
          videoId={videoId}
          startTime={startTime}
          endTime={endTime}
          duration={duration}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
          onSubmit={(params) => onEditSubmit({ type: "trim", params })}
          isProcessing={isProcessing}
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">Apply Filter</h3>
        <FilterVideoControl
          currentFilter={currentFilter}
          onChange={setCurrentFilter}
          isProcessing={isProcessing}
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">Adjust Speed</h3>
        <SpeedVideoControl
          videoId={videoId}
          onSubmit={(params) => onEditSubmit({ type: "speed", params })}
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">Add Subtitles</h3>
        <SubtitleVideoControl
          videoId={videoId}
          onSubmit={(params) => onEditSubmit({ type: "subtitle", params })}
        />
      </Card>
    </div>
  );
};

export default EditingControlsPanel;
