import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { Video } from "@/hooks/use-video-enhancements";
import { CustomIcon } from "@/components/ui/icons";

interface VideoCardProps {
  video: Video;
  isSelected: boolean;
  onSelect: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isSelected,
  onSelect,
}) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer p-4 transition-all duration-300 ${
          isSelected
            ? "bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon"
            : "bg-white/5 border border-white/10 hover:border-aurora-blue/50"
        }`}
        onClick={onSelect}
      >
        <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
          {video.output_url ? (
            <video
              src={video.output_url}
              className="w-full h-full object-cover"
              poster="/placeholder.svg"
            />
          ) : (
            <div className="w-full h-full bg-aurora-black/50 flex items-center justify-center">
              <span className="text-sm text-gray-400">No preview</span>
            </div>
          )}

          {isSelected && (
            <div className="absolute top-2 right-2 bg-aurora-blue/90 rounded-full p-1">
              <CustomIcon name="play" className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <div className="font-medium truncate">{video.prompt}</div>
      </Card>
    </motion.div>
  );
};
