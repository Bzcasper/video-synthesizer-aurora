
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { VideoCard } from "@/components/video/VideoCard";
import { VideoFilters } from "@/components/video/VideoFilters";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
type SortOption = 'date-desc' | 'date-asc' | 'duration-desc' | 'duration-asc';
type StatusFilter = 'all' | VideoJobStatus;

interface Video {
  id: string;
  output_url: string | null;
  created_at: string | null;
  duration: number;
  prompt: string;
  status: VideoJobStatus;
}

const VideosPage = () => {
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos', sortBy, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('video_jobs')
        .select('*');

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      switch (sortBy) {
        case 'date-desc':
          query = query.order('created_at', { ascending: false });
          break;
        case 'date-asc':
          query = query.order('created_at', { ascending: true });
          break;
        case 'duration-desc':
          query = query.order('duration', { ascending: false });
          break;
        case 'duration-asc':
          query = query.order('duration', { ascending: true });
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Error loading videos",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      return data as Video[];
    }
  });

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin-slow">
          <img
            src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
            alt="Loading..."
            className="w-16 h-16 filter brightness-150"
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
        <Button
          onClick={() => navigate('/dashboard/generate')}
          className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple text-white shadow-neon transform transition-all duration-300 hover:scale-105"
        >
          Generate New Video
        </Button>
      </div>

      <VideoFilters
        sortBy={sortBy}
        statusFilter={statusFilter}
        onSortChange={setSortBy}
        onStatusFilterChange={setStatusFilter}
      />

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-black/50 border-white/10">
          <div className="text-center space-y-4">
            <p className="text-xl text-gray-400">No videos found</p>
            <p className="text-sm text-gray-500">
              {statusFilter !== 'all' 
                ? `No videos with status "${statusFilter}". Try changing the filter.`
                : 'Start by generating a new video or uploading one to edit'}
            </p>
            <Button
              onClick={() => navigate('/dashboard/generate')}
              className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple text-white shadow-neon mt-4 transform transition-all duration-300 hover:scale-105"
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
