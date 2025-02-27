
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Play, Check } from 'lucide-react';
import type { Video } from '@/hooks/video/types';

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
    >
      <Card
        className={`group cursor-pointer p-4 transition-all duration-300 ${
          isSelected 
            ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
            : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
        }`}
        onClick={onClick}
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
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isSelected ? (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-aurora-blue" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all group-hover:bg-white/30">
                <Play className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
        <div className="font-medium truncate">{video.prompt}</div>
      </Card>
    </motion.div>
  );
};
