
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import ParameterPanel, { VideoParams } from '@/components/ParameterPanel';
import AssetUploadPanel from '@/components/AssetUploadPanel';
import MainContent from '@/components/MainContent';

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoParams, setVideoParams] = useState<VideoParams>();
  const { toast } = useToast();
  
  const { data: videoJobs, refetch: refetchJobs } = useQuery({
    queryKey: ['videoJobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_jobs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });

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

      const { error } = await supabase.functions.invoke('generate-video', {
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
        <MainContent videoJobs={videoJobs} />

        <aside className="w-80 flex flex-col gap-4">
          <AssetUploadPanel onUpload={handleFileUpload} />

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
