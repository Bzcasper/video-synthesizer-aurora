
import React from 'react';
import { Clock, BarChart, Users } from 'lucide-react';

interface VideoStatsProps {
  processingTime: number;
  totalVideos: number;
  activeUsers: number;
}

export const VideoStats: React.FC<VideoStatsProps> = ({
  processingTime,
  totalVideos,
  activeUsers,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-black/50 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 text-aurora-blue mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Processing Time</span>
        </div>
        <p className="text-2xl font-bold text-white">{processingTime}s</p>
      </div>
      <div className="bg-black/50 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 text-aurora-purple mb-2">
          <BarChart className="w-4 h-4" />
          <span className="text-sm font-medium">Total Videos</span>
        </div>
        <p className="text-2xl font-bold text-white">{totalVideos}</p>
      </div>
      <div className="bg-black/50 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 text-aurora-green mb-2">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Active Users</span>
        </div>
        <p className="text-2xl font-bold text-white">{activeUsers}</p>
      </div>
    </div>
  );
};
