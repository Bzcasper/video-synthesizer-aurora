/** @format */

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  onError?: () => void;
  className?: string;
}

export function EnhancedVideoPlayer({
  src,
  title,
  poster,
  onError,
  className,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [hasError, setHasError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set up event listeners when the component mounts
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const onLoadedMetadata = () => {
      setDuration(videoElement.duration);
      setIsLoading(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      const duration = videoElement.duration;
      setProgress(
        duration > 0 ? (videoElement.currentTime / duration) * 100 : 0
      );
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    const onError = () => {
      setHasError(true);
      setIsLoading(false);
      if (onError) onError();
    };

    // Add event listeners
    videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
    videoElement.addEventListener("timeupdate", onTimeUpdate);
    videoElement.addEventListener("ended", onEnded);
    videoElement.addEventListener("error", onError);

    // Clean up event listeners
    return () => {
      videoElement.removeEventListener("loadedmetadata", onLoadedMetadata);
      videoElement.removeEventListener("timeupdate", onTimeUpdate);
      videoElement.removeEventListener("ended", onEnded);
      videoElement.removeEventListener("error", onError);
    };
  }, [onError]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Set volume
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;

    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  // Seek to position
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;

    const newTime = (value[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(value[0]);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  // Show controls on mouse move, hide after delay
  const handleMouseMove = () => {
    setIsControlsVisible(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Restart video
  const restartVideo = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);

    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (!videoRef.current) return;

    const newTime = Math.min(
      videoRef.current.duration,
      videoRef.current.currentTime + 10
    );
    videoRef.current.currentTime = newTime;
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (!videoRef.current) return;

    const newTime = Math.max(0, videoRef.current.currentTime - 10);
    videoRef.current.currentTime = newTime;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if video is focused or no input element is focused
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT")
      ) {
        return;
      }

      const videoElement = videoRef.current;
      if (!videoElement) return;

      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (videoElement.currentTime > 5) {
            videoElement.currentTime -= 5;
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (videoElement.currentTime < videoElement.duration - 5) {
            videoElement.currentTime += 5;
          }
          break;
        case "ArrowUp": {
          event.preventDefault();
          const newVolumeUp = Math.min(1, volume + 0.1);
          handleVolumeChange([newVolumeUp]);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          const newVolumeDown = Math.max(0, volume - 0.1);
          handleVolumeChange([newVolumeDown]);
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay, handleVolumeChange, volume]);

  return (
    <Card className={`relative overflow-hidden bg-black ${className}`}>
      <div
        className="relative aspect-video"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setIsControlsVisible(false)}>
        {/* Video Element */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-contain"
          playsInline
        />

        {/* Loading State */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-12 h-12 rounded-full border-4 border-aurora-blue/30 border-t-aurora-blue animate-spin" />
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
            <div className="text-red-500 mb-2">⚠️ Unable to load video</div>
            <p className="text-center text-sm text-gray-400 mb-4">
              The video file could not be played.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Video Controls */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent
            ${isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {/* Title (if provided) */}
          {title && (
            <div className="absolute top-4 left-4 right-4 text-white font-medium text-shadow">
              {title}
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full mb-4 min-h-4">
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
              aria-label={`Seek video, current time ${formatTime(currentTime)} of ${formatTime(duration)}`}
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-2">
              {/* Play/Pause Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 h-11 w-11"
                aria-label={isPlaying ? "Pause video" : "Play video"}>
                {isPlaying ? <Pause /> : <Play />}
              </Button>

              {/* Restart Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={restartVideo}
                className="text-white hover:bg-white/20 h-11 w-11"
                aria-label="Restart video from beginning">
                <RotateCcw size={18} />
              </Button>

              {/* Skip Forward Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={skipForward}
                className="text-white hover:bg-white/20 h-11 w-11"
                aria-label="Skip forward 10 seconds">
                <RotateCw size={18} />
              </Button>

              {/* Volume Controls */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 h-10 w-10"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                  aria-label={`Volume control, current volume ${(isMuted ? 0 : volume) * 100}%`}
                />
              </div>
            </div>

            {/* Fullscreen Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 h-11 w-11"
              aria-label={
                document.fullscreenElement
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }>
              <Maximize size={20} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
