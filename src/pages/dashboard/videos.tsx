
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  output_url: string;
  created_at: string;
  duration: number;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

const VideoCard = ({ video }: { video: Video }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-aurora-blue/50 transition-all duration-300">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        {video.output_url ? (
          <video 
            src={video.output_url}
            className="w-full h-full object-cover"
            poster="/placeholder.svg"
          />
        ) : (
          <div className="w-full h-full bg-aurora-black/50 flex items-center justify-center">
            <span className="text-sm text-gray-400">No preview available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-lg text-white truncate">
          {video.prompt || "Untitled Video"}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(video.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm px-2 py-1 rounded-full ${
            video.status === 'completed' ? 'bg-green-500/20 text-green-400' :
            video.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
            video.status === 'error' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
          </span>
          
          <Button
            onClick={() => navigate(`/dashboard/edit/${video.id}`)}
            className="bg-aurora-blue hover:bg-aurora-blue/80 text-white"
            size="sm"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Video
          </Button>
        </div>
      </div>
    </Card>
  );
};

const VideosPage = () => {
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin-slow">
          <img
            src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
            alt="Loading..."
            className="w-16 h-16"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading videos. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-gradient bg-gradient-glow">My Videos</h1>
      </div>

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-white/5 border-white/10">
          <div className="text-center space-y-4">
            <p className="text-xl text-gray-400">No videos generated yet</p>
            <p className="text-sm text-gray-500">
              Start by generating a new video or uploading one to edit
            </p>
            <Button
              onClick={() => navigate('/dashboard/generate')}
              className="bg-aurora-blue hover:bg-aurora-blue/80 text-white mt-4"
            >
              Generate New Video
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VideosPage;
