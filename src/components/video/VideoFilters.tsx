
import { Filter, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
type SortOption = 'date-desc' | 'date-asc' | 'duration-desc' | 'duration-asc';
type StatusFilter = 'all' | VideoJobStatus;

interface VideoFiltersProps {
  sortBy: SortOption;
  statusFilter: StatusFilter;
  onSortChange: (value: SortOption) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
}

export const VideoFilters = ({
  sortBy,
  statusFilter,
  onSortChange,
  onStatusFilterChange,
}: VideoFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 glassmorphism rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-aurora-blue" />
        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}>
          <SelectTrigger className="w-[180px] bg-black/50 border-white/10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-aurora-blue" />
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px] bg-black/50 border-white/10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="duration-desc">Longest First</SelectItem>
            <SelectItem value="duration-asc">Shortest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
