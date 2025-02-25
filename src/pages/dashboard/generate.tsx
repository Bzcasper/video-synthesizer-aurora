
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const Generate = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement video generation logic
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-white">Generate Video</h1>
      </div>

      <Card className="p-6 bg-white/5 border-white/10">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Video Description</label>
            <Textarea
              placeholder="Describe the video you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 bg-white/5 border-white/10 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isGenerating || !prompt}
            className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                     hover:from-aurora-blue hover:to-aurora-purple"
          >
            {isGenerating ? "Generating..." : "Generate Video"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Generate;
