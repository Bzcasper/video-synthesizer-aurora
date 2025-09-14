import React from "react";
import VideoStyleOption from "@/components/generate/VideoStyleOption";

interface VideoStyle {
  id: string;
  label: string;
  description: string;
}

interface VideoStyleOptionsProps {
  videoStyles: VideoStyle[];
  selectedStyle: string;
  onStyleSelect: (id: string) => void;
}

const VideoStyleOptions: React.FC<VideoStyleOptionsProps> = ({
  videoStyles,
  selectedStyle,
  onStyleSelect,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-200">Video Style</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoStyles.map((styleOption) => (
          <VideoStyleOption
            key={styleOption.id}
            id={styleOption.id}
            label={styleOption.label}
            description={styleOption.description}
            isSelected={selectedStyle === styleOption.id}
            onSelect={onStyleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoStyleOptions;
