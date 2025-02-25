
import React from 'react';

interface VideoPreviewProps {
  videoUrl: string | null;
  thumbnailUrl: string | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoUrl,
  thumbnailUrl,
}) => {
  return (
    <div className="aspect-video bg-black/50 border border-white/10 rounded-lg overflow-hidden">
      {videoUrl ? (
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          controls
          poster={thumbnailUrl || undefined}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Video preview will appear here
        </div>
      )}
    </div>
  );
};
