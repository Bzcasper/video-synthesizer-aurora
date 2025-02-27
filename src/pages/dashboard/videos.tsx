
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { VideoCard } from "@/components/video/VideoCard";
import { VideoFilters } from "@/components/video/VideoFilters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyVideos } from "@/components/video/EmptyVideos";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { type Database } from "@/integrations/supabase/types";
import { Plus, Search, Grid, List, Star, Trash2, Edit2, Clock, Calendar } from 'lucide-react';
import { StatusBadge } from "@/components/video/StatusBadge";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
type SortOption = 'date-desc' | 'date-asc' | 'duration-desc' | 'duration-asc' | 'title-asc' | 'title-desc';
type StatusFilter = 'all' | VideoJobStatus;
type ViewMode = 'grid' | 'list';

interface Video {
  id: string;
  output_url: string | null;
  created_at: string | null;
  duration: number;
  prompt: string;
  status: VideoJobStatus;
  isFavorite?: boolean;
}

const VideosPage = () => {
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeTab, setActiveTab] = useState('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data: videos, isLoading, error, refetch } = useQuery({
    queryKey: ['videos', sortBy, statusFilter, activeTab, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('video_jobs')
        .select('*');

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply tab filter
      if (activeTab === 'processing') {
        query = query.eq('status', 'processing');
      } else if (activeTab === 'completed') {
        query = query.eq('status', 'completed');
      }

      // Apply search filter
      if (searchQuery) {
        query = query.ilike('prompt', `%${searchQuery}%`);
      }

      // Apply sorting
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
        case 'title-asc':
          query = query.order('prompt', { ascending: true });
          break;
        case 'title-desc':
          query = query.order('prompt', { ascending: false });
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

      // Add favorite status to videos
      const videosWithFavorites = (data as Video[]).map(video => ({
        ...video,
        isFavorite: favorites.includes(video.id)
      }));

      // Filter for favorites tab
      if (activeTab === 'favorites') {
        return videosWithFavorites.filter(video => video.isFavorite);
      }

      return videosWithFavorites;
    }
  });

  // Load favorites from local storage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteVideos');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to local storage when they change
  useEffect(() => {
    localStorage.setItem('favoriteVideos', JSON.stringify(favorites));
  }, [favorites]);

  const navigate = useNavigate();

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    if (isFavorite) {
      setFavorites(prev => [...prev, id]);
      toast({
        title: "Added to favorites",
        description: "Video added to your favorites",
      });
    } else {
      setFavorites(prev => prev.filter(videoId => videoId !== id));
      toast({
        title: "Removed from favorites",
        description: "Video removed from your favorites",
      });
    }
  };

  const handleDeleteVideo = async (id: string) => {
    // Show confirmation dialog
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('video_jobs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove from favorites if it exists
      setFavorites(prev => prev.filter(videoId => videoId !== id));
      
      toast({
        title: "Video deleted",
        description: "Your video has been deleted successfully",
      });
      
      // Refetch videos to update the list
      refetch();
      
    } catch (error: any) {
      toast({
        title: "Error deleting video",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Error loading videos. Please try again later." />;
  }

  // Calculate stats
  const totalVideos = videos?.length || 0;
  const processingVideos = videos?.filter(v => v.status === 'processing').length || 0;
  const completedVideos = videos?.filter(v => v.status === 'completed').length || 0;
  const favoriteVideos = videos?.filter(v => v.isFavorite).length || 0;

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

      {/* Dashboard Stats */}
      <DashboardStats 
        totalVideos={totalVideos}
        processingVideos={processingVideos}
        completedVideos={completedVideos}
        favoriteVideos={favoriteVideos}
      />

      {/* Tabs and Filters */}
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
            <TabsList className="bg-black/30 border border-white/10 p-1">
              <TabsTrigger value="recent" className="dashboard-tab">Recent</TabsTrigger>
              <TabsTrigger value="processing" className="dashboard-tab">Processing</TabsTrigger>
              <TabsTrigger value="completed" className="dashboard-tab">Completed</TabsTrigger>
              <TabsTrigger value="favorites" className="dashboard-tab">Favorites</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-aurora-blue/20' : 'bg-transparent'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-aurora-blue/20' : 'bg-transparent'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 border-white/10"
              />
            </div>
            <VideoFilters
              sortBy={sortBy}
              statusFilter={statusFilter}
              onSortChange={setSortBy}
              onStatusFilterChange={setStatusFilter}
            />
          </div>

          <TabsContent value="recent" className="space-y-4 mt-0">
            {renderVideoGrid()}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4 mt-0">
            {renderVideoGrid('processing')}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-0">
            {renderVideoGrid('completed')}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4 mt-0">
            {renderVideoGrid('favorites')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function renderVideoGrid(tabFilter?: string) {
    let filteredVideos = videos || [];

    // Apply tab-specific filtering
    if (tabFilter === 'processing') {
      filteredVideos = filteredVideos.filter(video => video.status === 'processing');
    } else if (tabFilter === 'completed') {
      filteredVideos = filteredVideos.filter(video => video.status === 'completed');
    } else if (tabFilter === 'favorites') {
      filteredVideos = filteredVideos.filter(video => video.isFavorite);
    }

    if (filteredVideos.length === 0) {
      return <EmptyVideos statusFilter={tabFilter as StatusFilter || statusFilter} />;
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredVideos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onFavoriteToggle={handleToggleFavorite}
              onDeleteVideo={handleDeleteVideo}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <div key={video.id} className="glassmorphism hover:bg-white/10 p-2 transition-all">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-48 aspect-video">
                  {video.output_url ? (
                    <video 
                      src={video.output_url}
                      className="w-full h-full object-cover rounded-md"
                      poster="/placeholder.svg"
                    />
                  ) : (
                    <div className="w-full h-full bg-aurora-black/50 flex items-center justify-center rounded-md">
                      <span className="text-sm text-gray-400">No preview</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full p-2">
                  <div className="space-y-2">
                    <h3 className="font-medium text-base text-white">{video.prompt || "Untitled Video"}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                      </div>
                      {video.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(video.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      <StatusBadge status={video.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFavorite(video.id, !video.isFavorite)}
                    >
                      {video.isFavorite ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm" 
                      onClick={() => navigate(`/dashboard/edit/${video.id}`)}
                      disabled={video.status === 'processing' || video.status === 'failed'}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
};

export default VideosPage;
