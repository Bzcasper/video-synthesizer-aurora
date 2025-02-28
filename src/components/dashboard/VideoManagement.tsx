// src/components/dashboard/VideoManagement.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Download,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VideoJobStatus } from "@/types/video";

type SortOption = "newest" | "oldest" | "duration-asc" | "duration-desc";
type ViewType = "grid" | "list";

interface Video {
  id: string;
  prompt: string;
  duration: number;
  status: VideoJobStatus;
  created_at: string;
  output_url: string | null;
  thumbnail_url: string | null;
}

export default function VideoManagement() {
  const [activeTab, setActiveTab] = useState<VideoJobStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const queryClient = useQueryClient();

  const {
    data: videos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["videos", activeTab, sortBy, searchQuery],
    queryFn: async () => {
      let query = supabase.from("video_jobs").select("*");

      if (activeTab !== "all") {
        query = query.eq("status", activeTab);
      }

      if (searchQuery) {
        query = query.ilike("prompt", `%${searchQuery}%`);
      }

      switch (sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "duration-asc":
          query = query.order("duration", { ascending: true });
          break;
        case "duration-desc":
          query = query.order("duration", { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as Video[];
    },
  });

  const deleteVideo = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase
        .from("video_jobs")
        .delete()
        .eq("id", videoId);

      if (error) throw error;

      return videoId;
    },
    onSuccess: (videoId) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast({
        title: "Video deleted",
        description: "The video has been permanently removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete video",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  const handleDeleteVideo = (videoId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      deleteVideo.mutate(videoId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: VideoJobStatus) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: VideoJobStatus) => {
    switch (status) {
      case "pending":
        return "Queued";
      case "processing":
        return "Processing";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">My Videos</h1>
        <Button
          className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
          onClick={() => (window.location.href = "/dashboard/generate")}
        >
          Generate New Video
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="duration-asc">Shortest First</SelectItem>
              <SelectItem value="duration-desc">Longest First</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-md overflow-hidden border">
            <Button
              variant="ghost"
              size="icon"
              className={`${viewType === "grid" ? "bg-gray-100" : ""}`}
              onClick={() => setViewType("grid")}
            >
              <Grid3X3 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${viewType === "list" ? "bg-gray-100" : ""}`}
              onClick={() => setViewType("list")}
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as VideoJobStatus | "all")}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Failed to load videos. Please try again.
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No videos found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "No videos match your search query."
                  : activeTab !== "all"
                  ? `You don't have any ${activeTab} videos.`
                  : "Get started by generating your first video."}
              </p>
              <Button
                onClick={() => (window.location.href = "/dashboard/generate")}
                className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
              >
                Generate Video
              </Button>
            </div>
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-lg border overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.prompt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        No preview
                      </div>
                    )}

                    {video.status === "completed" && video.output_url && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                          onClick={() =>
                            (window.location.href = `/dashboard/videos/${video.id}`)
                          }
                        >
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {getStatusIcon(video.status)}
                      <span>{getStatusText(video.status)}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-medium mb-1 line-clamp-1"
                      title={video.prompt}
                    >
                      {video.prompt}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatDate(video.created_at)}</span>
                      <span>{video.duration}s</span>
                    </div>

                    <div className="flex mt-4 justify-end space-x-2">
                      {video.status === "completed" && video.output_url && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(video.output_url!, "_blank")
                            }
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {videos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-16 bg-gray-100 rounded mr-3 overflow-hidden">
                            {video.thumbnail_url ? (
                              <img
                                src={video.thumbnail_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div
                            className="truncate max-w-xs"
                            title={video.prompt}
                          >
                            {video.prompt}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {video.duration}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(video.status)}
                          <span className="ml-1 text-sm text-gray-700">
                            {getStatusText(video.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(video.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {video.status === "completed" && video.output_url && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  (window.location.href = `/dashboard/videos/${video.id}`)
                                }
                              >
                                <Play className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(video.output_url!, "_blank")
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
