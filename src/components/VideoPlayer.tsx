// src/components/VideoPlayer.tsx
import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Download,
  Share,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  onError?: (error: Error) => void;
}

export default function VideoPlayer({
  src,
  title,
  poster,
  onError,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (!videoRef.current) return;

    const volumeValue = newVolume[0];
    videoRef.current.volume = volumeValue;
    setVolume(volumeValue);
    setIsMuted(volumeValue === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      videoRef.current.volume = 0;
      setVolume(0);
    } else {
      videoRef.current.volume = 1;
      setVolume(1);
    }
  };

  const handleSeek = (newProgress: number[]) => {
    if (!videoRef.current) return;

    const seekTime = (newProgress[0] / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgress(newProgress[0]);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return;

    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleError = () => {
    if (onError) {
      onError(new Error("Failed to load video"));
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onEnded={() => setIsPlaying(false)}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <div className="flex-1 px-2">
              <Slider
                value={[progress]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="cursor-pointer"
              />
            </div>

            <span className="text-xs text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>

              <div className="w-24">
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.01}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative group">
                <Button variant="ghost" size="icon" className="text-white">
                  <Settings className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-full mb-2 right-0 bg-black/90 p-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                  <div className="space-y-1 text-xs">
                    <p className="text-white font-medium">Playback Speed</p>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.5, 1, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRateChange(rate)}
                          className={`px-2 py-1 rounded ${
                            playbackRate === rate
                              ? "bg-blue-500 text-white"
                              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!isPlaying && !currentTime && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            onClick={togglePlay}
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}

      {title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 via-black/40 to-transparent">
          <h3 className="text-white font-medium">{title}</h3>
        </div>
      )}
    </div>
  );
}
