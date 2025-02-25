
'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { InputPanel } from '@/components/dashboard/InputPanel'
import { ControlPanel } from '@/components/dashboard/ControlPanel'
import { VideoStats } from '@/components/dashboard/VideoStats'
import { VideoPreview } from '@/components/dashboard/VideoPreview'

const AuroraVideoSynthDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [prompt, setPrompt] = useState<string>('');
  const [duration, setDuration] = useState<number>(15);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Mock data for stats (replace with real data in production)
  const processingTime = 45;
  const totalVideos = 1234;
  const activeUsers = 567;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload logic
      toast.success('Image uploaded successfully');
    }
  };

  const handleVideoGeneration = () => {
    setIsProcessing(true);
    // Simulate video generation
    setTimeout(() => {
      setIsProcessing(false);
      setVideoUrl('path/to/generated/video.mp4');
      toast.success('Video generated successfully');
    }, 3000);
  };

  const handlePlayVideo = () => {
    // Handle video playback
  };

  const handleDownload = () => {
    if (videoUrl) {
      // Handle video download
      toast.success('Download started');
    }
  };

  const handleShare = () => {
    if (videoUrl) {
      // Handle video sharing
      toast.success('Sharing options opened');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-aurora-black to-black/95 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <VideoStats
          processingTime={processingTime}
          totalVideos={totalVideos}
          activeUsers={activeUsers}
        />
        
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <VideoPreview
              videoUrl={videoUrl}
              thumbnailUrl={thumbnailUrl}
            />
          </div>
          
          <div className="space-y-8">
            <InputPanel
              prompt={prompt}
              setPrompt={setPrompt}
              handleImageUpload={handleImageUpload}
              handleVideoGeneration={handleVideoGeneration}
              isProcessing={isProcessing}
            />
            
            <ControlPanel
              duration={duration}
              setDuration={setDuration}
              handlePlayVideo={handlePlayVideo}
              handleDownload={handleDownload}
              handleShare={handleShare}
              isVideoReady={!!videoUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuroraVideoSynthDashboard;
