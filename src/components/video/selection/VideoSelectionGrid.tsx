
import React from 'react';
import type { Video } from '@/hooks/video/types';
import { VideoCard } from './VideoCard';

interface VideoSelectionGridProps {
  videos: Video[];
  selectedVideo: string | null;
  onSelectVideo: (id: string) => void;
}

export const VideoSelectionGrid: React.FC<VideoSelectionGridProps> = ({ 
  videos, 
  selectedVideo, 
  onSelectVideo 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos?.map((video) => (
        <VideoCard 
          key={video.id}
          video={video}
          isSelected={selectedVideo === video.id}
          onClick={() => onSelectVideo(video.id)}
        />
      ))}
    </div>
  );
};
