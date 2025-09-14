import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Video, RefreshCw, HardDrive, Cpu } from "lucide-react";

interface DashboardStatsProps {
  totalVideos: number;
  processingVideos: number;
  completedVideos: number;
  favoriteVideos: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalVideos,
  processingVideos,
  completedVideos,
  favoriteVideos,
}) => {
  // Calculate percentages for the progress bars
  const processingPercentage =
    totalVideos > 0 ? (processingVideos / totalVideos) * 100 : 0;
  const completedPercentage =
    totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;
  const favoritesPercentage =
    totalVideos > 0 ? (favoriteVideos / totalVideos) * 100 : 0;

  // Simulate storage usage (would be replaced with actual data in production)
  const storageUsage = Math.min(75, Math.max(5, totalVideos * 5)); // 5% per video, min 5%, max 75%

  // Simulate API usage based on processing videos
  const apiUsage = Math.min(85, Math.max(10, processingVideos * 25)); // 25% per processing video, min 10%, max 85%

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total Videos */}
      <Card className="bg-gradient-to-br from-aurora-black to-black/80 border border-white/10 hover:border-aurora-blue/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Total Videos</h3>
            <div className="p-2 bg-aurora-blue/20 rounded-full">
              <Video className="h-4 w-4 text-aurora-blue" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-orbitron font-bold text-white">
              {totalVideos}
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Completed</span>
                <span>{completedPercentage.toFixed(0)}%</span>
              </div>
              <Progress
                value={completedPercentage}
                className="h-1.5"
                indicatorClassName="bg-gradient-to-r from-aurora-blue to-aurora-purple"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Videos */}
      <Card className="bg-gradient-to-br from-aurora-black to-black/80 border border-white/10 hover:border-aurora-blue/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">
              Processing Videos
            </h3>
            <div className="p-2 bg-aurora-purple/20 rounded-full">
              <RefreshCw className="h-4 w-4 text-aurora-purple" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-orbitron font-bold text-white">
              {processingVideos}
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>In Progress</span>
                <span>{processingPercentage.toFixed(0)}%</span>
              </div>
              <Progress
                value={processingPercentage}
                className="h-1.5"
                indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card className="bg-gradient-to-br from-aurora-black to-black/80 border border-white/10 hover:border-aurora-blue/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Storage Usage</h3>
            <div className="p-2 bg-green-500/20 rounded-full">
              <HardDrive className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-orbitron font-bold text-white">
              {storageUsage}%
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Available</span>
                <span>{(100 - storageUsage).toFixed(0)}%</span>
              </div>
              <Progress
                value={storageUsage}
                className="h-1.5"
                indicatorClassName="bg-gradient-to-r from-green-500 to-aurora-green"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Usage */}
      <Card className="bg-gradient-to-br from-aurora-black to-black/80 border border-white/10 hover:border-aurora-blue/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">API Usage</h3>
            <div className="p-2 bg-amber-500/20 rounded-full">
              <Cpu className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-orbitron font-bold text-white">
              {apiUsage}%
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Limit</span>
                <span>{(100 - apiUsage).toFixed(0)}%</span>
              </div>
              <Progress
                value={apiUsage}
                className="h-1.5"
                indicatorClassName="bg-gradient-to-r from-amber-500 to-yellow-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
