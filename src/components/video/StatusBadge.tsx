
import { type Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];

interface StatusBadgeProps {
  status: VideoJobStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          className: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: "Completed"
        };
      case 'processing':
        return {
          className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <Loader2 className="w-3 h-3 mr-1 animate-spin" />,
          label: "Processing"
        };
      case 'failed':
        return {
          className: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <AlertTriangle className="w-3 h-3 mr-1" />,
          label: "Failed"
        };
      default:
        return {
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Clock className="w-3 h-3 mr-1" />,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
    }
  };

  const { className, icon, label } = getStatusConfig();

  return (
    <Badge variant="outline" className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full transition-colors duration-300 ${className}`}>
      {icon}
      {label}
    </Badge>
  );
};
