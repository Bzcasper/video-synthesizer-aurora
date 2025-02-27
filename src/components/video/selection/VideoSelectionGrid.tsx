
import React, { memo } from 'react';
import type { Video } from '@/hooks/use-video-enhancements';
import { VideoCard } from './VideoCard';
import { AnimatePresence, motion } from 'framer-motion';

interface VideoSelectionGridProps {
  videos: Video[];
  selectedVideo: string | null;
  onSelectVideo: (id: string) => void;
}

export const VideoSelectionGrid: React.FC<VideoSelectionGridProps> = memo(({ 
  videos, 
  selectedVideo, 
  onSelectVideo 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="listbox"
      aria-label="Available videos for enhancement"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence mode="popLayout">
        {videos?.map((video) => (
          <VideoCard 
            key={video.id}
            video={video}
            isSelected={selectedVideo === video.id}
            onClick={() => onSelectVideo(video.id)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

VideoSelectionGrid.displayName = 'VideoSelectionGrid';
