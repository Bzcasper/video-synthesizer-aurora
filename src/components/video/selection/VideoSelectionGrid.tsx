
import React from 'react';
import type { Video } from '@/hooks/use-video-enhancements';
import { VideoCard } from './VideoCard';

interface VideoSelectionGridProps {
  videos: Video[];
  selectedVideo: string | null;
  onSelectVideo: (id: string) => void;
}

export const VideoSelectionGrid = ({ 
  videos, 
  selectedVideo, 
  onSelectVideo 
}: VideoSelectionGridProps) => {
  if (!videos?.length) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
        <p className="text-gray-400">No videos available for enhancement.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          isSelected={selectedVideo === video.id}
          onSelect={() => onSelectVideo(video.id)}
        />
      ))}
    </div>
  );
};
