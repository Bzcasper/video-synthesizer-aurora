
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Video, Sparkles, Film, Clock, Text, Mic } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { type Database } from "@/integrations/supabase/types";

type VideoJobStatus = Database["public"]["Enums"]["video_job_status"];
type EnhancementType = Database["public"]["Enums"]["video_enhancement_type"];
type FilterType = Database["public"]["Enums"]["video_filter_type"];

interface Video {
  id: string;
  output_url: string | null;
  created_at: string | null;
  prompt: string;
  status: VideoJobStatus;
}

interface Enhancement {
  id: EnhancementType;
  label: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const enhancements: Enhancement[] = [
  {
    id: "upscale",
    label: "Super Resolution",
    description: "Upscale your video to 4K with AI-enhanced details",
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    id: "frame_interpolation",
    label: "Frame Interpolation",
    description: "Create smooth slow-motion with AI frame generation",
    icon: <Film className="w-8 h-8" />,
  },
  {
    id: "filter",
    label: "Style Filters",
    description: "Apply cinematic and artistic filters",
    icon: <Video className="w-8 h-8" />,
  },
  {
    id: "speed_adjustment",
    label: "Speed Control",
    description: "Create slow-motion or timelapse effects",
    icon: <Clock className="w-8 h-8" />,
  },
  {
    id: "subtitle_overlay",
    label: "Subtitles",
    description: "Add AI-generated or custom subtitles",
    icon: <Text className="w-8 h-8" />,
  },
  {
    id: "lip_sync",
    label: "Lip Sync",
    description: "Synchronize speech with animated characters",
    icon: <Mic className="w-8 h-8" />,
    comingSoon: true,
  },
];

export const VideoEnhancementSelector = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedEnhancement, setSelectedEnhancement] = useState<Enhancement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");
  const [speedFactor, setSpeedFactor] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user's videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_jobs')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading videos",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      return data as Video[];
    }
  });

  const handleSubmitEnhancement = async () => {
    if (!selectedVideo || !selectedEnhancement) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('video_enhancements')
        .insert({
          video_id: selectedVideo,
          enhancement_type: selectedEnhancement.id,
          filter_type: selectedEnhancement.id === 'filter' ? selectedFilter : null,
          speed_factor: selectedEnhancement.id === 'speed_adjustment' ? speedFactor : null,
          status: 'pending',
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Enhancement submitted",
        description: "Your video enhancement is being processed",
      });

      // Reset selections after successful submission
      setSelectedEnhancement(null);
    } catch (error: any) {
      toast({
        title: "Error submitting enhancement",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow">
          Select Video to Enhance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos?.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer p-4 transition-all duration-300 ${
                  selectedVideo === video.id 
                    ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
                    : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
                }`}
                onClick={() => setSelectedVideo(video.id)}
              >
                <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                  {video.output_url ? (
                    <video
                      src={video.output_url}
                      className="w-full h-full object-cover"
                      poster="/placeholder.svg"
                    />
                  ) : (
                    <div className="w-full h-full bg-aurora-black/50 flex items-center justify-center">
                      <span className="text-sm text-gray-400">No preview</span>
                    </div>
                  )}
                </div>
                <div className="font-medium truncate">{video.prompt}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div className="space-y-6">
          <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow">
            Choose Enhancement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancements.map((enhancement) => (
              <Tooltip key={enhancement.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer p-6 transition-all duration-300 ${
                        enhancement.comingSoon ? 'opacity-50 cursor-not-allowed' :
                        selectedEnhancement?.id === enhancement.id 
                          ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
                          : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
                      }`}
                      onClick={() => !enhancement.comingSoon && setSelectedEnhancement(enhancement)}
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="text-aurora-blue">{enhancement.icon}</div>
                        <div>
                          <div className="font-medium mb-2">{enhancement.label}</div>
                          <div className="text-sm text-gray-400">{enhancement.description}</div>
                        </div>
                        {enhancement.comingSoon && (
                          <span className="text-xs px-2 py-1 rounded-full bg-aurora-purple/20 text-aurora-purple">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-center">
                  {enhancement.description}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {selectedEnhancement && (
            <div className="space-y-4">
              {selectedEnhancement.id === 'filter' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Filter Style</label>
                  <Select
                    value={selectedFilter}
                    onValueChange={(value: FilterType) => setSelectedFilter(value)}
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue placeholder="Choose a filter style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedEnhancement.id === 'speed_adjustment' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Speed Factor</label>
                  <Select
                    value={speedFactor.toString()}
                    onValueChange={(value) => setSpeedFactor(parseFloat(value))}
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue placeholder="Select speed factor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x (Slow Motion)</SelectItem>
                      <SelectItem value="1">1x (Normal)</SelectItem>
                      <SelectItem value="1.5">1.5x (Fast)</SelectItem>
                      <SelectItem value="2">2x (Very Fast)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                onClick={handleSubmitEnhancement}
                disabled={isSubmitting}
                className="w-full md:w-auto bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple text-white shadow-neon"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" />
                    Enhance Video
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
