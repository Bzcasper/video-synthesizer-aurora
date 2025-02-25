
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateForm from "@/components/generate/GenerateForm";
import { VideoEnhancementSelector } from "@/components/video/VideoEnhancementSelector";
import { Card } from "@/components/ui/card";

const Generate = () => {
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
            <GenerateForm />
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
