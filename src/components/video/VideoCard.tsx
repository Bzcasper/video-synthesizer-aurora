
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Edit2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];

interface Video {
  id: string;
  output_url: string | null;
  created_at: string | null;
  duration: number;
  prompt: string;
  status: VideoJobStatus;
}

interface VideoCardProps {
  video: Video;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="group relative overflow-hidden bg-black/50 border-white/10 hover:border-aurora-blue/50 transition-all duration-300">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        {video.output_url ? (
          <video 
            src={video.output_url}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
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
        <h3 className="font-medium text-lg text-white line-clamp-1 group-hover:text-aurora-blue transition-colors">
          {video.prompt || "Untitled Video"}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
          </div>
          {video.created_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(video.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={video.status} />
          
          <Button
            onClick={() => navigate(`/dashboard/edit/${video.id}`)}
            className="bg-aurora-blue hover:bg-aurora-blue/80 text-white shadow-neon transform transition-all duration-300 hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,166,255,0.4)]"
            size="sm"
            disabled={video.status === 'processing' || video.status === 'failed'}
          >
            {video.status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Video
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
