
import { Filter, ArrowUpDown, SortAsc, SortDesc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
type SortOption = 'date-desc' | 'date-asc' | 'duration-desc' | 'duration-asc' | 'title-asc' | 'title-desc';
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="status-filter" className="text-sm font-medium text-aurora-blue">
          <Filter className="w-4 h-4 inline-block mr-2" />
          Filter by Status
        </Label>
        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}>
          <SelectTrigger id="status-filter" name="status-filter" className="w-[180px] bg-black/50 border-white/10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sort-by" className="text-sm font-medium text-aurora-blue">
          <ArrowUpDown className="w-4 h-4 inline-block mr-2" />
          Sort Videos
        </Label>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger id="sort-by" name="sort-by" className="w-[180px] bg-black/50 border-white/10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10">
            <SelectItem value="date-desc">
              <span className="flex items-center">
                <SortDesc className="w-3 h-3 mr-2" /> Newest First
              </span>
            </SelectItem>
            <SelectItem value="date-asc">
              <span className="flex items-center">
                <SortAsc className="w-3 h-3 mr-2" /> Oldest First
              </span>
            </SelectItem>
            <SelectItem value="duration-desc">
              <span className="flex items-center">
                <SortDesc className="w-3 h-3 mr-2" /> Longest First
              </span>
            </SelectItem>
            <SelectItem value="duration-asc">
              <span className="flex items-center">
                <SortAsc className="w-3 h-3 mr-2" /> Shortest First
              </span>
            </SelectItem>
            <SelectItem value="title-asc">
              <span className="flex items-center">
                <SortAsc className="w-3 h-3 mr-2" /> A-Z
              </span>
            </SelectItem>
            <SelectItem value="title-desc">
              <span className="flex items-center">
                <SortDesc className="w-3 h-3 mr-2" /> Z-A
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
