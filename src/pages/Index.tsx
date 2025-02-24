
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Play, Pause, Settings, Image as ImageIcon, FileAudio } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import VideoPreview from '@/components/VideoPreview';
import ParameterPanel, { VideoParams } from '@/components/ParameterPanel';
import FileUpload from '@/components/FileUpload';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoParams, setVideoParams] = useState<VideoParams>();
  const { toast } = useToast();
  
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
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          params: videoParams,
        }
      });

      if (error) throw error;

      toast({
        title: "Video Generation Started",
        description: "You'll be notified when your video is ready"
      });

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

  const handleFileUpload = useCallback((files: FileList, type: 'image' | 'audio') => {
    const file = files[0];
    if (!file) return;

    toast({
      title: `${type === 'image' ? 'Image' : 'Audio'} uploaded`,
      description: `${file.name} has been uploaded successfully`
    });
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
