
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/video/common/ProgressBar';
import { TimeRemaining } from '@/components/video/common/TimeRemaining';
import { StatusIndicator } from '@/components/video/common/StatusIndicator';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import VideoStyleOption from './VideoStyleOption';
import GenerateButton from './GenerateButton';
import DurationSlider from './DurationSlider';
import { Checkbox } from '@/components/ui/checkbox';
import VideoDescriptionInput from './VideoDescriptionInput';
import { useVideoGeneration } from '@/hooks/video/use-video-generation';
import { VideoJobStatus } from '@/hooks/video/types';

interface Style {
  id: string;
  label: string;
  description: string;
}

// Predefined video styles
const videoStyles: Style[] = [
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Professional movie-like quality with dramatic lighting'
  },
  {
    id: 'animation',
    label: 'Animation',
    description: 'Stylized animated visuals in various styles'
  },
  {
    id: 'realistic',
    label: 'Realistic',
    description: 'Photo-realistic imagery with natural lighting'
  },
  {
    id: 'abstract',
    label: 'Abstract',
    description: 'Artistic and non-representational visuals'
  },
  {
    id: 'vintage',
    label: 'Vintage',
    description: 'Retro aesthetics from different time periods'
  },
  {
    id: 'aurora',
    label: 'Aurora',
    description: 'Ethereal visuals with aurora-like colors and effects'
  }
];

// Resolution options
const resolutions = [
  { value: '480p', label: '480p (SD)' },
  { value: '720p', label: '720p (HD)' },
  { value: '1080p', label: '1080p (Full HD)', default: true },
  { value: '1440p', label: '1440p (2K)', premium: true },
  { value: '2160p', label: '2160p (4K)', premium: true }
];

// Aspect ratio options
const aspectRatios = [
  { value: '16:9', label: '16:9 (Landscape)', default: true },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '4:3', label: '4:3 (Classic)' },
  { value: '21:9', label: '21:9 (Ultrawide)', premium: true }
];

const EnhancedGenerateForm = () => {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(10);
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [resolution, setResolution] = useState('1080p');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const {
    isGenerating,
    progress,
    currentStage,
    timeRemaining,
    error,
    generateVideo,
    cancelGeneration
  } = useVideoGeneration();

  // Start video generation
  const startGeneration = () => {
    if (!description) {
      toast({
        description: "Please provide a description for your video.",
        variant: "destructive",
      });
      return;
    }

    generateVideo({
      prompt: description,
      duration,
      style: selectedStyle,
      resolution,
      aspectRatio
    });
  };

  return (
    <AnimatePresence mode="wait">
      {isGenerating ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-4xl mx-auto"
        >
          <Card className="glass-panel border-aurora-blue/30">
            <CardHeader>
              <CardTitle className="text-gradient bg-gradient-glow">
                Generating Your Video
              </CardTitle>
              <CardDescription>
                {error ? (
                  <span className="text-red-500">{error}</span>
                ) : (
                  `Creating a ${duration} second ${selectedStyle} video based on your description`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <StatusIndicator status={currentStage as VideoJobStatus} />
                <ProgressBar progress={progress} />
                <TimeRemaining timeRemaining={timeRemaining} />

                <div className="mt-4 p-4 bg-black/30 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Your Prompt</h3>
                  <p className="text-white/80 italic">"{description}"</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {error ? (
                <Button 
                  onClick={() => window.location.reload()}
                  variant="default"
                >
                  Try Again
                </Button>
              ) : (
                <Button 
                  onClick={cancelGeneration}
                  variant="outline"
                  disabled={progress >= 100}
                >
                  Cancel Generation
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-4xl mx-auto"
        >
          <Card className="glass-panel border-aurora-blue/30">
            <CardHeader>
              <CardTitle className="text-gradient bg-gradient-glow">
                Create a New Video
              </CardTitle>
              <CardDescription>
                Enter a detailed description to create an AI-generated video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Video Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your video in detail, including scenes, mood, colors, and any specific elements you want to include..."
                  className="min-h-32 bg-black/20 border-white/10 focus:border-aurora-blue/50"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              {/* Video Style Selection */}
              <div className="space-y-2">
                <Label>Video Style</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {videoStyles.map((style) => (
                    <VideoStyleOption
                      key={style.id}
                      id={style.id}
                      label={style.label}
                      description={style.description}
                      isSelected={selectedStyle === style.id}
                      onSelect={setSelectedStyle}
                    />
                  ))}
                </div>
              </div>
              
              {/* Video Duration */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <span className="text-sm text-gray-400">{duration}s</span>
                </div>
                <Slider
                  id="duration"
                  min={5}
                  max={60}
                  step={5}
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5s</span>
                  <span>30s</span>
                  <span>60s</span>
                </div>
              </div>
              
              {/* Advanced Settings Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="flex items-center text-sm text-aurora-blue hover:text-aurora-blue/80 transition-colors"
                >
                  <span className="mr-2">{isAdvancedOpen ? '−' : '+'}</span>
                  Advanced Settings
                </button>
                
                <AnimatePresence>
                  {isAdvancedOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4"
                    >
                      <div className="p-4 bg-black/20 rounded-lg space-y-4">
                        {/* Resolution Selection */}
                        <div>
                          <Label className="mb-2 block">Resolution</Label>
                          <div className="flex flex-wrap gap-2">
                            {resolutions.map((res) => (
                              <Button
                                key={res.value}
                                type="button"
                                variant={resolution === res.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setResolution(res.value)}
                                className={res.premium ? "relative" : ""}
                              >
                                {res.label}
                                {res.premium && (
                                  <span className="absolute -top-2 -right-2 bg-aurora-purple text-white text-xs px-1 rounded-full">
                                    PRO
                                  </span>
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Aspect Ratio Selection */}
                        <div>
                          <Label className="mb-2 block">Aspect Ratio</Label>
                          <div className="flex flex-wrap gap-2">
                            {aspectRatios.map((ratio) => (
                              <Button
                                key={ratio.value}
                                type="button"
                                variant={aspectRatio === ratio.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setAspectRatio(ratio.value)}
                                className={ratio.premium ? "relative" : ""}
                              >
                                {ratio.label}
                                {ratio.premium && (
                                  <span className="absolute -top-2 -right-2 bg-aurora-purple text-white text-xs px-1 rounded-full">
                                    PRO
                                  </span>
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {/* AI Enhancement Option */}
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="ai-enhance" 
                            checked={useAI} 
                            onCheckedChange={(checked) => setUseAI(checked as boolean)}
                          />
                          <label
                            htmlFor="ai-enhance"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Use AI enhancement (recommended)
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={startGeneration}
                className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                           hover:from-aurora-blue hover:to-aurora-purple shadow-lg transition-all"
              >
                Generate Video
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedGenerateForm;
