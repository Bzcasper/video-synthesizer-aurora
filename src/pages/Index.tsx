
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, Play, Pause, Settings, Image as ImageIcon } from 'lucide-react';
import VideoPreview from '@/components/VideoPreview';
import ParameterPanel from '@/components/ParameterPanel';
import FileUpload from '@/components/FileUpload';

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // TODO: Implement video generation logic
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground/90">Video Synthesizer</h1>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex gap-6 flex-1">
        <div className="flex-1 glass-panel p-6 hover-glow">
          <VideoPreview />
        </div>

        <aside className="w-80 flex flex-col gap-4">
          <div className="glass-panel p-4 hover-glow animate-fade-in">
            <FileUpload
              label="Upload Images"
              accept="image/*"
              icon={<ImageIcon className="w-5 h-5" />}
              onChange={(files) => console.log('Images:', files)}
            />
          </div>

          <div className="glass-panel p-4 space-y-6 hover-glow animate-fade-in">
            <ParameterPanel />
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
