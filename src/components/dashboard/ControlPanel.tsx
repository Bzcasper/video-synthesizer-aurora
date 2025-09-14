import React from "react";
import { Sliders, Play, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ControlPanelProps {
  duration: number;
  setDuration: (value: number) => void;
  handlePlayVideo: () => void;
  handleDownload: () => void;
  handleShare: () => void;
  isVideoReady: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  duration,
  setDuration,
  handlePlayVideo,
  handleDownload,
  handleShare,
  isVideoReady,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-200">Duration</label>
          <span className="text-sm text-gray-400">{duration}s</span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={(value) => setDuration(value[0])}
          max={60}
          step={1}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="w-full bg-black/50 border-white/10 text-white hover:bg-white/5"
          onClick={handlePlayVideo}
          disabled={!isVideoReady}
        >
          <Play className="w-4 h-4 mr-2" />
          Play
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black/50 border-white/10 text-white hover:bg-white/5"
          onClick={handleDownload}
          disabled={!isVideoReady}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black/50 border-white/10 text-white hover:bg-white/5"
          onClick={handleShare}
          disabled={!isVideoReady}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};
