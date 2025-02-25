
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateForm from "@/components/generate/GenerateForm";
import { VideoEnhancementSelector } from "@/components/video/VideoEnhancementSelector";
import { Card } from "@/components/ui/card";

const Generate = () => {
  // State management for the generate form
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5); // Default duration of 5 seconds
  const [style, setStyle] = useState('cinematic'); // Default style
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // TODO: Implement video generation logic here
    
    setIsGenerating(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-orbitron font-bold text-gradient bg-gradient-glow">
        Create & Enhance
      </h1>

      <Card className="glass-panel p-6">
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger
              value="generate"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-aurora-purple data-[state=active]:to-aurora-blue"
            >
              Generate Video
            </TabsTrigger>
            <TabsTrigger
              value="enhance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-aurora-purple data-[state=active]:to-aurora-blue"
            >
              Enhance Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <GenerateForm
              prompt={prompt}
              setPrompt={setPrompt}
              duration={duration}
              setDuration={setDuration}
              style={style}
              setStyle={setStyle}
              isGenerating={isGenerating}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          <TabsContent value="enhance" className="space-y-6">
            <VideoEnhancementSelector />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Generate;
