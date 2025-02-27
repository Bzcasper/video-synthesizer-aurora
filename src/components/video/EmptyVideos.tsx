
import { VideoIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
type StatusFilter = 'all' | VideoJobStatus | 'favorites';

interface EmptyVideosProps {
  statusFilter: StatusFilter;
}

export const EmptyVideos = ({ statusFilter }: EmptyVideosProps) => {
  const navigate = useNavigate();

  // Determine the message based on the status filter
  const getMessage = () => {
    switch (statusFilter) {
      case 'processing':
        return {
          title: "No processing videos",
          description: "You don't have any videos currently being processed.",
          icon: <div className="bg-blue-500/20 p-4 rounded-full"><VideoIcon className="h-8 w-8 text-blue-400" /></div>
        };
      case 'completed':
        return {
          title: "No completed videos",
          description: "You don't have any completed videos yet.",
          icon: <div className="bg-green-500/20 p-4 rounded-full"><VideoIcon className="h-8 w-8 text-green-400" /></div>
        };
      case 'pending':
        return {
          title: "No pending videos",
          description: "You don't have any videos pending processing.",
          icon: <div className="bg-yellow-500/20 p-4 rounded-full"><VideoIcon className="h-8 w-8 text-yellow-400" /></div>
        };
      case 'failed':
        return {
          title: "No failed videos",
          description: "Great! You don't have any failed videos.",
          icon: <div className="bg-red-500/20 p-4 rounded-full"><VideoIcon className="h-8 w-8 text-red-400" /></div>
        };
      case 'favorites':
        return {
          title: "No favorite videos",
          description: "You haven't added any videos to your favorites yet.",
          icon: <div className="bg-yellow-500/20 p-4 rounded-full"><Star className="h-8 w-8 text-yellow-400" /></div>
        };
      default:
        return {
          title: "No videos found",
          description: "You haven't created any videos yet.",
          icon: <div className="bg-purple-500/20 p-4 rounded-full"><VideoIcon className="h-8 w-8 text-purple-400" /></div>
        };
    }
  };

  const { title, description, icon } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 border border-white/10 rounded-lg h-[300px]">
      {icon}
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
      <Button
        onClick={() => navigate('/dashboard/generate')}
        className="mt-6 bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
      >
        Generate a Video
      </Button>
    </div>
  );
};
