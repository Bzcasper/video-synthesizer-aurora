
import React, { memo } from 'react';
import type { Video } from '@/hooks/use-video-enhancements';
import { VideoCard } from './VideoCard';
import { AnimatePresence } from 'framer-motion';

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
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="listbox"
      aria-label="Available videos for enhancement"
    >
      <AnimatePresence>
        {videos?.map((video) => (
          <VideoCard 
            key={video.id}
            video={video}
            isSelected={selectedVideo === video.id}
            onClick={() => onSelectVideo(video.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

VideoSelectionGrid.displayName = 'VideoSelectionGrid';
