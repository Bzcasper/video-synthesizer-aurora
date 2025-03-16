import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ClockIcon, PlayIcon, AlertCircle, PlusCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Video } from '@/hooks/video/types';
import { Link } from 'react-router-dom';

interface RecentVideosListProps {
  title?: string;
  limit?: number;
  showSeeAll?: boolean;
  minHeight?: number;
}

const RecentVideosList: React.FC<RecentVideosListProps> = ({ 
  title = "Recent Videos", 
  limit = 4, 
  showSeeAll = true,
  minHeight 
}) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const fallbackThumbnail = "/placeholder.svg";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsError(true);
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
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [limit]);

  if (isError) {
    return (
      <div className="glass-panel p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="text-gray-400 flex items-center justify-center min-h-[200px]">
          <p>Failed to load videos</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`glass-panel p-4 rounded-lg space-y-4 ${minHeight ? `min-h-[${minHeight}px]` : ''}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {showSeeAll && videos && videos.length > 0 && (
          <Link 
            to="/dashboard/videos" 
            className="text-sm text-aurora-blue hover:text-aurora-purple transition-colors flex items-center gap-1"
          >
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="h-[120px] rounded-md animate-pulse bg-white/5"></div>
          ))}
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.slice(0, limit).map((video) => (
            <Link key={video.id} to={`/dashboard/videos/${video.id}`}>
              <div className="group relative rounded-md overflow-hidden h-[120px] hover:ring-2 hover:ring-aurora-blue transition-all">
                <img 
                  src={video.output_url || fallbackThumbnail}
                  alt={video.prompt || "Video thumbnail"} 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = fallbackThumbnail;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-sm font-medium text-white truncate group-hover:text-aurora-blue transition-colors">
                    {video.prompt || "Untitled Video"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(video.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-8 border border-dashed border-white/10 rounded-lg bg-white/5">
          <PlusCircle className="h-12 w-12 text-gray-500" />
          <div className="text-center">
            <p className="text-gray-400 mb-2">No videos yet</p>
            <Button
              variant="outline"
              className="text-aurora-blue border-aurora-blue hover:bg-aurora-blue/10"
              onClick={() => navigate('/dashboard/generate')}
            >
              Generate Your First Video
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentVideosList;
