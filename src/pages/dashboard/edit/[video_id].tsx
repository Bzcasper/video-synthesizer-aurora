
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import VideoPreviewPanel from "@/components/video-edit/VideoPreviewPanel";
import TrimVideoControl from "@/components/video-edit/TrimVideoControl";
import FilterVideoControl from "@/components/video-edit/FilterVideoControl";

const VideoEditPage = () => {
  const { video_id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [filter, setFilter] = useState('none');
  const [isProcessingTrim, setIsProcessingTrim] = useState(false);
  const [isProcessingFilter, setIsProcessingFilter] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data, error } = await supabase
          .from('video_jobs')
          .select('*')
          .eq('id', video_id)
          .single();

        if (error) throw error;

        setVideo(data);
        if (data.duration) {
          setEndTime(data.duration);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        toast({
          title: "Error",
          description: "Failed to load video details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (video_id) {
      fetchVideo();
    }
  }, [video_id]);

  const handleApplyTrim = async () => {
    if (!video) return;

    setIsProcessingTrim(true);
    try {
      const { data, error } = await supabase
        .from('video_edits')
        .insert([
          {
            original_video_id: video.id,
            operation: 'trim',
            parameters: {
              start_time: startTime,
              end_time: endTime
            },
            user_id: video.user_id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trim operation started",
      });

    } catch (error) {
      console.error('Error applying trim:', error);
      toast({
        title: "Error",
        description: "Failed to apply trim edit",
        variant: "destructive",
      });
    } finally {
      setIsProcessingTrim(false);
    }
  };

  const handleApplyFilter = async (selectedFilter: string) => {
    if (!video || selectedFilter === 'none') return;

    setIsProcessingFilter(true);
    try {
      const { data, error } = await supabase
        .from('video_edits')
        .insert([
          {
            original_video_id: video.id,
            operation: 'filter',
            parameters: {
              filter: selectedFilter
            },
            user_id: video.user_id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setFilter(selectedFilter);
      toast({
        title: "Success",
        description: "Filter applied successfully",
      });

    } catch (error) {
      console.error('Error applying filter:', error);
      toast({
        title: "Error",
        description: "Failed to apply filter",
        variant: "destructive",
      });
    } finally {
      setIsProcessingFilter(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-aurora-blue">Loading...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-300">Video not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-glow mb-8">
        Edit Video
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Preview - Takes up 2 columns on larger screens */}
        <div className="lg:col-span-2">
          <VideoPreviewPanel
            videoUrl={video.output_url}
            startTime={startTime}
            endTime={endTime}
            filter={filter}
          />
        </div>

        {/* Editing Controls - Takes up 1 column */}
        <div className="space-y-6">
          <TrimVideoControl
            startTime={startTime}
            endTime={endTime}
            duration={video.duration}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onApplyTrim={handleApplyTrim}
            isProcessing={isProcessingTrim}
          />

          <FilterVideoControl
            onFilterApply={handleApplyFilter}
            isProcessing={isProcessingFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoEditPage;
