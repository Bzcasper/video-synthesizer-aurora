
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PanelHeader } from '@/components/video/common/PanelHeader';
import { PlatformSelector } from './PlatformSelector';
import { ExtractedContent } from './ExtractedContent';
import { BlogExtractor } from '@/lib/social/BlogExtractor';
import { VideoGenerationOptions, Platform } from '@/types/social';
import { useGenerateSocialVideo } from '@/hooks/social/use-generate-social-video';

export const BlogToVideoConverter: React.FC = () => {
  const [url, setUrl] = useState('');
  const [extractedContent, setExtractedContent] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram']);
  const [videoOptions, setVideoOptions] = useState<VideoGenerationOptions>({
    voiceStyle: 'conversational',
    visualStyle: 'modern',
    musicType: 'upbeat',
    duration: 30,
    includeIntro: true,
    includeCaptions: true
  });
  
  const { toast } = useToast();
  const { generateVideo, isGenerating, generationProgress, generationStage } = useGenerateSocialVideo();

  const handleExtractContent = async () => {
    if (!url) {
      toast({
        title: "Missing URL",
        description: "Please enter a blog URL to extract content",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    try {
      const content = await BlogExtractor.extractFromUrl(url);
      setExtractedContent(content);
      toast({
        title: "Content Extracted",
        description: `Successfully extracted ${content.length} key sections from the blog post`
      });
    } catch (error) {
      console.error("Error extracting blog content:", error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to extract content from the URL",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerateVideos = async () => {
    if (extractedContent.length === 0) {
      toast({
        title: "No Content Available",
        description: "Please extract content from a blog post first",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one social media platform",
        variant: "destructive"
      });
      return;
    }

    try {
      await generateVideo(extractedContent, selectedPlatforms, videoOptions);
      toast({
        title: "Video Generation Started",
        description: "Your social media clips are being generated. You'll be notified when they're ready."
      });
    } catch (error) {
      console.error("Error generating videos:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate social media videos",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Blog to Social Media Converter"
        description="Convert blog articles into engaging video clips for social media platforms"
      />

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Extract Blog Content</CardTitle>
          <CardDescription>
            Enter a blog URL to extract key sections for video creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter blog URL (e.g., https://example.com/blog-post)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={isExtracting}
              />
              <Button 
                onClick={handleExtractContent} 
                disabled={isExtracting || !url}
              >
                {isExtracting ? "Extracting..." : "Extract Content"}
              </Button>
            </div>

            {extractedContent.length > 0 && (
              <ExtractedContent sections={extractedContent} />
            )}
          </div>
        </CardContent>
      </Card>

      {extractedContent.length > 0 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Generate Social Media Videos</CardTitle>
            <CardDescription>
              Customize and generate videos for different platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="platforms">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="platforms">Platforms</TabsTrigger>
                <TabsTrigger value="settings">Video Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="platforms" className="space-y-4 pt-4">
                <PlatformSelector 
                  selectedPlatforms={selectedPlatforms}
                  onChange={setSelectedPlatforms}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="voice-style">Voice Style</Label>
                    <Select 
                      value={videoOptions.voiceStyle} 
                      onValueChange={(value) => setVideoOptions({...videoOptions, voiceStyle: value as any})}
                    >
                      <SelectTrigger id="voice-style">
                        <SelectValue placeholder="Select voice style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="energetic">Energetic</SelectItem>
                        <SelectItem value="calm">Calm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visual-style">Visual Style</Label>
                    <Select 
                      value={videoOptions.visualStyle} 
                      onValueChange={(value) => setVideoOptions({...videoOptions, visualStyle: value as any})}
                    >
                      <SelectTrigger id="visual-style">
                        <SelectValue placeholder="Select visual style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="vibrant">Vibrant</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="music-type">Background Music</Label>
                    <Select 
                      value={videoOptions.musicType} 
                      onValueChange={(value) => setVideoOptions({...videoOptions, musicType: value as any})}
                    >
                      <SelectTrigger id="music-type">
                        <SelectValue placeholder="Select music type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upbeat">Upbeat</SelectItem>
                        <SelectItem value="relaxed">Relaxed</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="none">No Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      Target Duration: {videoOptions.duration} seconds
                    </Label>
                    <Select 
                      value={videoOptions.duration.toString()} 
                      onValueChange={(value) => setVideoOptions({...videoOptions, duration: parseInt(value)})}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds (Instagram/TikTok)</SelectItem>
                        <SelectItem value="30">30 seconds (Reels/TikTok)</SelectItem>
                        <SelectItem value="60">60 seconds (Reels/Shorts)</SelectItem>
                        <SelectItem value="180">3 minutes (YouTube)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="include-intro"
                        checked={videoOptions.includeIntro}
                        onChange={(e) => setVideoOptions({...videoOptions, includeIntro: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="include-intro">Include Branded Intro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="include-captions"
                        checked={videoOptions.includeCaptions}
                        onChange={(e) => setVideoOptions({...videoOptions, includeCaptions: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="include-captions">Include Auto-Captions</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Will generate {selectedPlatforms.length} video{selectedPlatforms.length !== 1 ? 's' : ''}
            </div>
            <Button
              onClick={handleGenerateVideos}
              disabled={isGenerating || selectedPlatforms.length === 0}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90"
            >
              {isGenerating ? "Generating..." : "Generate Videos"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {isGenerating && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Generating Videos</CardTitle>
            <CardDescription>
              {generationStage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={generationProgress} className="w-full" />
            <p className="mt-2 text-sm text-center text-gray-400">
              This may take a few minutes. You'll be notified when your videos are ready.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
