import { useState, useRef } from 'react';
import type { FC, TouchEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Edit2, Loader2, Play, Share2, Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

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

interface ResponsiveVideoCardProps {
  video: Video;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onDeleteVideo?: (id: string) => void;
}

export const ResponsiveVideoCard: FC<ResponsiveVideoCardProps> = ({ 
  video, 
  onFavoriteToggle, 
  onDeleteVideo 
}) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Touch swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);
  const [isSwipedRight, setIsSwipedRight] = useState(false);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Calculate swipe distance
    if (touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const isLeft = distance > minSwipeDistance;
      const isRight = distance < -minSwipeDistance;
      
      // Apply transform based on swipe direction and distance
      if (cardRef.current) {
        if (isLeft) {
          // Limit the transform to a maximum value
          const transform = Math.min(distance, 100);
          cardRef.current.style.transform = `translateX(-${transform}px)`;
          setIsSwipedLeft(true);
          setIsSwipedRight(false);
        } else if (isRight) {
          // Limit the transform to a maximum value
          const transform = Math.min(-distance, 100);
          cardRef.current.style.transform = `translateX(${transform}px)`;
          setIsSwipedRight(true);
          setIsSwipedLeft(false);
        } else {
          cardRef.current.style.transform = 'translateX(0)';
          setIsSwipedLeft(false);
          setIsSwipedRight(false);
        }
      }
    }
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    // Reset card position with animation
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease';
      cardRef.current.style.transform = 'translateX(0)';
      
      // Execute action based on swipe direction
      if (isSwipedLeft && onDeleteVideo) {
        // Show confirmation before deleting
        if (confirm('Are you sure you want to delete this video?')) {
          onDeleteVideo(video.id);
        }
      } else if (isSwipedRight && onFavoriteToggle) {
        onFavoriteToggle(video.id, !video.isFavorite);
        toast({
          description: video.isFavorite 
            ? "Removed from favorites" 
            : "Added to favorites",
        });
      }
      
      // Reset swipe states
      setTimeout(() => {
        setIsSwipedLeft(false);
        setIsSwipedRight(false);
        if (cardRef.current) {
          cardRef.current.style.transition = '';
        }
      }, 300);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  const handlePlay = () => {
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
  
  const handleShare = () => {
    if (video.output_url) {
      navigator.clipboard.writeText(video.output_url);
      toast({
        title: "Link copied",
        description: "Video link copied to clipboard",
      });
    }
  };
  
  const handleEdit = () => {
    navigate(`/dashboard/edit/${video.id}`);
  };

  return (
    <Card 
      ref={cardRef}
      className="relative overflow-hidden bg-black/50 border-white/10 hover:border-aurora-blue/50 transition-all duration-300"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Swipe indicators */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-green-500/20 to-transparent opacity-0 transition-opacity duration-300 flex items-center justify-center">
        <Star className="text-yellow-400 h-6 w-6" />
      </div>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-red-500/20 to-transparent opacity-0 transition-opacity duration-300 flex items-center justify-center">
        <Trash2 className="text-red-400 h-6 w-6" />
      </div>
      
      {/* Swipe hint text (shown on first load) */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100">
        <p className="text-center px-4">
          Swipe right to favorite<br />
          Swipe left to delete
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row">
        {/* Video thumbnail */}
        <div className="aspect-video sm:w-1/3 relative overflow-hidden">
          {video.output_url ? (
            <video 
              ref={videoRef}
              src={video.output_url}
              className="w-full h-full object-cover"
              poster="/placeholder.svg"
              onClick={handlePlay}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePlay();
                }
              }}
              tabIndex={0}
              aria-label={`Video: ${video.prompt || "Untitled Video"}`}
            >
              <track kind="captions" src="" label="English" />
            </video>
          ) : (
            <div className="w-full h-full bg-aurora-black/50 flex items-center justify-center">
              <span className="text-sm text-gray-400">No preview</span>
            </div>
          )}
          
          {/* Play button overlay */}
          {video.output_url && (
            <button 
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={handlePlay}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePlay();
                }
              }}
              aria-label="Play video"
            >
              <span className="flex items-center justify-center h-10 w-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full">
                <Play className="h-5 w-5" />
              </span>
            </button>
          )}
          
          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <StatusBadge status={video.status} />
          </div>
        </div>
        
        {/* Video info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-base sm:text-lg text-white line-clamp-1 hover:text-aurora-blue transition-colors">
              {video.prompt || "Untitled Video"}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              {video.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{new Date(video.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {video.isFavorite && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400" />
                  <span>Favorite</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleShare}
                size="sm"
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8 px-2 sm:px-3"
                disabled={!video.output_url || video.status !== 'completed'}
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              
              <Button
                onClick={() => onFavoriteToggle?.(video.id, !video.isFavorite)}
                size="sm"
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8 px-2 sm:px-3"
              >
                {video.isFavorite ? (
                  <>
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 fill-yellow-400 text-yellow-400" />
                    <span className="hidden sm:inline">Favorited</span>
                  </>
                ) : (
                  <>
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Favorite</span>
                  </>
                )}
              </Button>
            </div>
            
            <Button
              onClick={handleEdit}
              className="bg-aurora-blue hover:bg-aurora-blue/80 text-white shadow-neon transform transition-all duration-300 hover:scale-105 h-8 px-2 sm:px-3"
              size="sm"
              disabled={video.status === 'processing' || video.status === 'failed'}
            >
              {video.status === 'processing' ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1 animate-spin" />
                  <span className="hidden sm:inline">Processing</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
