
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ClockIcon, PlayIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Video } from '@/hooks/video/types';

interface RecentVideosListProps {
  limit?: number;
}

const RecentVideosList: React.FC<RecentVideosListProps> = ({ limit = 5 }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("You must be logged in to view your videos");
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('video_jobs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        
        setVideos(data as Video[]);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load your videos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-3 rounded-lg">
            <Skeleton className="w-20 h-12 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 opacity-80" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
        <PlayIcon className="w-12 h-12 text-gray-400 opacity-60" />
        <p className="text-gray-400">You haven't created any videos yet</p>
        <Button 
          onClick={() => navigate('/dashboard/generate')}
          variant="outline" 
          className="mt-2"
        >
          Create Your First Video
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <div 
          key={video.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => navigate(`/dashboard/videos/${video.id}`)}
        >
          <div className="relative w-20 h-12 bg-black/20 rounded overflow-hidden flex-shrink-0">
            {video.thumbnail_url ? (
              <img 
                src={video.thumbnail_url} 
                alt={video.prompt.substring(0, 20) + '...'}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
            {video.status === 'processing' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">
              {video.prompt.length > 45 
                ? video.prompt.substring(0, 45) + '...' 
                : video.prompt}
            </h4>
            <div className="flex items-center text-xs text-gray-400 gap-1 mt-1">
              <ClockIcon className="w-3 h-3" />
              <span>
                {video.created_at 
                  ? formatDistanceToNow(new Date(video.created_at), { addSuffix: true }) 
                  : 'Unknown time'}
              </span>
              <span className="mx-1">•</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                video.status === 'completed' 
                  ? 'bg-green-500/20 text-green-300' 
                  : video.status === 'failed' 
                    ? 'bg-red-500/20 text-red-300' 
                    : 'bg-blue-500/20 text-blue-300'
              }`}>
                {video.status === 'completed' 
                  ? 'Completed' 
                  : video.status === 'failed' 
                    ? 'Failed' 
                    : 'Processing'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentVideosList;
