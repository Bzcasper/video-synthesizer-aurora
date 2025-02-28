
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoCard } from '@/components/video/selection/VideoCard';
import { StatusBadge } from '@/components/video/StatusBadge';
import { Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoSelectionGrid } from '@/components/video/selection/VideoSelectionGrid';
import { EmptyVideos } from '@/components/video/EmptyVideos';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQuery } from '@tanstack/react-query';
import { VideoJobStatus } from '@/hooks/video/types';

type StatusFilter = 'all' | VideoJobStatus | 'favorites';

// Mock data for video list
const mockVideos = [
  {
    id: '1',
    title: 'Aurora Borealis Timelapse',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVyb3JhJTIwYm9yZWFsaXN8ZW58MHx8MHx8fDA%3D',
    duration: 32,
    createdAt: '2023-03-15T10:30:00Z',
    status: 'completed' as VideoJobStatus,
    views: 245,
    fileSize: '28.5 MB',
  },
  {
    id: '2',
    title: 'Sunset Over Mountain Range',
    thumbnailUrl: 'https://images.unsplash.com/photo-1634060685514-bd3ab1be902d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW91bnRhaW4lMjBzdW5zZXR8ZW58MHx8MHx8fDA%3D',
    duration: 18,
    createdAt: '2023-03-17T14:20:00Z',
    status: 'completed' as VideoJobStatus,
    views: 132,
    fileSize: '15.2 MB',
  },
  {
    id: '3',
    title: 'Cosmic Nebula Journey',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5lYnVsYXxlbnwwfHwwfHx8MA%3D%3D',
    duration: 45,
    createdAt: '2023-03-18T09:15:00Z',
    status: 'processing' as VideoJobStatus,
    views: 0,
    fileSize: '42.7 MB',
  },
  {
    id: '4',
    title: 'Ocean Waves in Slow Motion',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617001100859-3de6d1f2f86c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b2NlYW4lMjB3YXZlc3xlbnwwfHwwfHx8MA%3D%3D',
    duration: 28,
    createdAt: '2023-03-19T16:45:00Z',
    status: 'completed' as VideoJobStatus,
    views: 87,
    fileSize: '24.1 MB',
  },
  {
    id: '5',
    title: 'City Nightscape Hyperlapse',
    thumbnailUrl: 'https://images.unsplash.com/photo-1669664404906-6398e31e2a5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNpdHklMjBuaWdodCUyMHRpbWVsYXBzZXxlbnwwfHwwfHx8MA%3D%3D',
    duration: 22,
    createdAt: '2023-03-20T21:10:00Z',
    status: 'completed' as VideoJobStatus,
    views: 156,
    fileSize: '19.8 MB',
  },
  {
    id: '6',
    title: 'Abstract Fluid Animation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWJzdHJhY3QlMjBmbHVpZHxlbnwwfHwwfHx8MA%3D%3D',
    duration: 15,
    createdAt: '2023-03-21T11:25:00Z',
    status: 'failed' as VideoJobStatus,
    views: 0,
    fileSize: '0 MB',
  },
  {
    id: '7',
    title: 'Desert Sand Dunes Aerial',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576702438167-5341503c5ec4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzZXJ0JTIwYWVyaWFsfGVufDB8fDB8fHww',
    duration: 38,
    createdAt: '2023-03-22T13:40:00Z',
    status: 'completed' as VideoJobStatus,
    views: 92,
    fileSize: '34.3 MB',
  }
];

const fetchUserVideos = async (filter: StatusFilter = 'all') => {
  // Simulate API call with 1s delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Apply filters
  if (filter === 'all') {
    return mockVideos;
  } else if (filter === 'completed') {
    return mockVideos.filter(v => v.status === 'completed');
  } else if (filter === 'processing') {
    return mockVideos.filter(v => v.status === 'processing');
  } else if (filter === 'failed') {
    return mockVideos.filter(v => v.status === 'failed');
  }
  
  return mockVideos;
};

const VideosPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: videos, isLoading, error, refetch } = useQuery({
    queryKey: ['videos', activeTab],
    queryFn: () => fetchUserVideos(activeTab),
  });
  
  // Filter videos by search query
  const filteredVideos = videos?.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle video card click
  const handleVideoClick = (videoId: string) => {
    navigate(`/dashboard/edit/${videoId}`);
  };
  
  // Handle video generation button click
  const handleGenerateClick = () => {
    navigate('/dashboard/generate');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Videos</h1>
          <p className="text-gray-400 mt-1">Browse and manage your generated videos</p>
        </div>
        <Button
          onClick={handleGenerateClick}
          className="bg-gradient-to-r from-aurora-purple to-aurora-blue 
                   hover:from-aurora-blue hover:to-aurora-purple shadow-neon transition-all"
        >
          Generate New Video
        </Button>
      </div>
      
      <Card className="glass-panel border-aurora-blue/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Video Gallery</CardTitle>
            <div className="w-full sm:w-64">
              <Input
                type="search"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/30 border-white/10 focus:border-aurora-blue/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as StatusFilter)}>
            <div className="px-6">
              <TabsList className="bg-black/20 w-full justify-start">
                <TabsTrigger value="all">All Videos</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="p-6 pt-4">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingSpinner className="min-h-[300px]" />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10 text-red-400"
                  >
                    <p>Error loading videos. Please try again.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => refetch()} 
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </motion.div>
                ) : filteredVideos?.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {searchQuery ? (
                      <div className="text-center py-10 text-gray-400">
                        <p>No videos found matching "{searchQuery}"</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchQuery('')}
                          className="mt-4"
                        >
                          Clear Search
                        </Button>
                      </div>
                    ) : (
                      <EmptyVideos statusFilter={activeTab} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredVideos?.map((video) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card 
                            className="overflow-hidden hover-glow cursor-pointer h-full flex flex-col"
                            onClick={() => handleVideoClick(video.id)}
                          >
                            <div className="relative aspect-video overflow-hidden bg-black">
                              <img 
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {video.duration}s
                              </div>
                              <div className="absolute top-2 right-2">
                                <StatusBadge status={video.status} />
                              </div>
                            </div>
                            <CardContent className="flex-grow p-4">
                              <h3 className="font-medium text-white truncate">{video.title}</h3>
                              <div className="flex items-center text-xs text-gray-400 mt-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>
                                  {new Date(video.createdAt).toLocaleDateString()}
                                </span>
                                <span className="mx-2">•</span>
                                <span>{video.fileSize}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-white/5 px-6 py-4">
          <div className="text-xs text-gray-400">
            Showing {filteredVideos?.length || 0} of {videos?.length || 0} videos
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VideosPage;
