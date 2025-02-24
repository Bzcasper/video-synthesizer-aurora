
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Play, Pause, Settings, Image as ImageIcon, FileAudio } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import VideoPreview from '@/components/VideoPreview';
import ParameterPanel, { VideoParams } from '@/components/ParameterPanel';
import FileUpload from '@/components/FileUpload';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from '@tanstack/react-query';

interface VideoJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output_url: string | null;
  created_at: string;
  error_message?: string;
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoParams, setVideoParams] = useState<VideoParams>();
  const { toast } = useToast();
  
  // Fetch user's video jobs
  const { data: videoJobs, refetch: refetchJobs } = useQuery({
    queryKey: ['videoJobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_jobs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as VideoJob[];
    },
  });

  // Watch for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_jobs'
        },
        () => {
          refetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchJobs]);

  const handleGenerate = async () => {
    if (!videoParams) {
      toast({
        title: "Missing Parameters",
        description: "Please configure video generation parameters",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // First create a video job in Supabase
      const { data: jobData, error: jobError } = await supabase
        .from('video_jobs')
        .insert({
          prompt: videoParams.prompt,
          style: videoParams.style,
          duration: videoParams.duration,
          resolution: {
            width: videoParams.resolution.width,
            height: videoParams.resolution.height
          },
          status: 'pending'
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Then call the generate-video function
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          jobId: jobData.id,
          params: videoParams,
        }
      });

      if (error) throw error;

      toast({
        title: "Video Generation Started",
        description: "You'll be notified when your video is ready"
      });

      // Refetch jobs to show the new one
      refetchJobs();

    } catch (error) {
      console.error('Error starting video generation:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = useCallback(async (files: FileList, type: 'image' | 'audio') => {
    const file = files[0];
    if (!file) return;

    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('video-assets')
        .upload(`${type}/${crypto.randomUUID()}-${file.name}`, file);

      if (error) throw error;

      toast({
        title: `${type === 'image' ? 'Image' : 'Audio'} uploaded`,
        description: `${file.name} has been uploaded successfully`
      });

    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground/90">AI Video Synthesizer</h1>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex gap-6 flex-1">
        <div className="flex-1 glass-panel p-6 hover-glow">
          <VideoPreview />
          
          {/* Video Jobs List */}
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold">Your Videos</h2>
            <div className="space-y-2">
              {videoJobs?.map((job) => (
                <div 
                  key={job.id} 
                  className="p-4 rounded-lg bg-card border flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">Job ID: {job.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {job.status}
                    </p>
                  </div>
                  {job.output_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={job.output_url} target="_blank" rel="noopener noreferrer">
                        View Video
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="w-80 flex flex-col gap-4">
          <div className="glass-panel p-4 space-y-4 hover-glow animate-fade-in">
            <FileUpload
              label="Reference Images"
              accept="image/*"
              icon={<ImageIcon className="w-5 h-5" />}
              onChange={(files) => handleFileUpload(files, 'image')}
            />
            
            <FileUpload
              label="Audio Track"
              accept="audio/*"
              icon={<FileAudio className="w-5 h-5" />}
              onChange={(files) => handleFileUpload(files, 'audio')}
            />
          </div>

          <div className="glass-panel p-4 space-y-6 hover-glow animate-fade-in">
            <ParameterPanel onParamsChange={setVideoParams} />
          </div>

          <Button 
            className="w-full animate-fade-in"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Video"}
          </Button>
        </aside>
      </main>
    </div>
  );
};

export default Index;
