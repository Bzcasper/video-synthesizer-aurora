
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card
        className={`cursor-pointer p-4 transition-all duration-golden ${
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
        <div className="aspect-video relative rounded-lg overflow-hidden mb-4 group">
          {video.output_url ? (
            <motion.video
              src={video.output_url}
              className="w-full h-full object-cover transition-all duration-golden group-hover:scale-105"
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
        <motion.div 
          className="font-medium truncate"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          title={video.prompt || 'Untitled video'}
        >
          {video.prompt || 'Untitled video'}
        </motion.div>
      </Card>
    </motion.div>
  );
};
