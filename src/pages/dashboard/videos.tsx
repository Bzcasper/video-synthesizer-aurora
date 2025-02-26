
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { VideoCard } from "@/components/video/VideoCard";
import { VideoFilters } from "@/components/video/VideoFilters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyVideos } from "@/components/video/EmptyVideos";
import { type Database } from "@/integrations/supabase/types";
import { Plus } from 'lucide-react';

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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Error loading videos. Please try again later." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient bg-gradient-glow">
          My Videos
        </h1>
        <Button
          onClick={() => navigate('/dashboard/generate')}
          className="w-full sm:w-auto bg-gradient-to-r from-aurora-purple to-aurora-blue 
                   hover:from-aurora-blue hover:to-aurora-purple text-white shadow-neon 
                   transform transition-all duration-300 hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyVideos statusFilter={statusFilter} />
      )}
    </div>
  );
};

export default VideosPage;
