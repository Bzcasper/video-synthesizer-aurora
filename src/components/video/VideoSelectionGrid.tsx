
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import type { Video } from '@/hooks/use-video-enhancements';

interface VideoSelectionGridProps {
  videos: Video[];
  selectedVideo: string | null;
  onSelectVideo: (id: string) => void;
}

export const VideoSelectionGrid = ({ videos, selectedVideo, onSelectVideo }: VideoSelectionGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos?.map((video) => (
        <motion.div
          key={video.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={`cursor-pointer p-4 transition-all duration-300 ${
              selectedVideo === video.id 
                ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
                : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
            }`}
            onClick={() => onSelectVideo(video.id)}
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
            </div>
            <div className="font-medium truncate">{video.prompt}</div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
