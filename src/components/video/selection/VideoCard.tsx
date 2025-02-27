
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import type { Video } from '@/hooks/use-video-enhancements';

interface VideoCardProps {
  video: Video;
  isSelected: boolean;
  onClick: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card
        className={`cursor-pointer p-4 transition-all duration-300 ${
          isSelected 
            ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
            : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
        }`}
        onClick={onClick}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
            e.preventDefault();
          }
        }}
      >
        <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
          {video.output_url ? (
            <video
              src={video.output_url}
              className="w-full h-full object-cover"
              poster="/placeholder.svg"
              preload="none"
              muted
              aria-label={`Preview of video: ${video.prompt || 'Untitled video'}`}
            />
          ) : (
            <div className="w-full h-full bg-aurora-black/50 flex items-center justify-center">
              <span className="text-sm text-gray-400">No preview</span>
            </div>
          )}
        </div>
        <div className="font-medium truncate" title={video.prompt || 'Untitled video'}>
          {video.prompt || 'Untitled video'}
        </div>
      </Card>
    </motion.div>
  );
};
