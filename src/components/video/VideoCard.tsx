import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Calendar,
  Edit2,
  Loader2,
  Play,
  Share2,
  Heart,
  Trash2,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusBadge } from "./StatusBadge";
import { toast } from "@/hooks/use-toast";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];

interface Video {
  id: string;
  output_url: string | null;
  created_at: string | null;
  duration: number;
  prompt: string;
  status: VideoJobStatus;
  isFavorite?: boolean;
}

interface VideoCardProps {
  video: Video;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onDeleteVideo?: (id: string) => void;
}

export const VideoCard = ({
  video,
  onFavoriteToggle,
  onDeleteVideo,
}: VideoCardProps) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.output_url && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.output_url) {
      navigator.clipboard.writeText(video.output_url);
      toast({
        title: "Link copied",
        description: "Video link copied to clipboard",
      });
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(video.id, !video.isFavorite);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteVideo) {
      onDeleteVideo(video.id);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-black/50 border-white/10 hover:border-aurora-blue/50 transition-all duration-300 card-hover-effect">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        {video.output_url ? (
          <video
            ref={videoRef}
            src={video.output_url}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            poster="/placeholder.svg"
          />
        ) : (
          <div className="w-full h-full bg-aurora-black/50 flex items-center justify-center">
            <span className="text-sm text-gray-400">No preview available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Video actions on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 video-card-actions flex items-center justify-between">
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePlay}
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full"
                    disabled={!video.output_url || video.status !== "completed"}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Play</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleShare}
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full"
                    disabled={!video.output_url || video.status !== "completed"}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleFavoriteToggle}
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full"
                  >
                    {video.isFavorite ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {video.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDelete}
                  size="icon"
                  className="bg-white/20 hover:bg-red-500/30 backdrop-blur-sm rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-medium text-lg text-white line-clamp-1 group-hover:text-aurora-blue transition-colors">
          {video.prompt || "Untitled Video"}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {Math.floor(video.duration / 60)}:
              {(video.duration % 60).toString().padStart(2, "0")}
            </span>
          </div>
          {video.created_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(video.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={video.status} />

          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/edit/${video.id}`);
            }}
            className="bg-aurora-blue hover:bg-aurora-blue/80 text-white shadow-neon transform transition-all duration-300 hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,166,255,0.4)]"
            size="sm"
            disabled={
              video.status === "processing" || video.status === "failed"
            }
          >
            {video.status === "processing" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Video
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
