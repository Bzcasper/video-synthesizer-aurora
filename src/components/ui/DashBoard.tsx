'use client'

import React, { useState, useEffect } from 'react'
import { 
  Camera, Upload, Image as ImageIcon, Film, 
  Sliders, Play, Download, Share2, Clock, 
  CheckCircle, AlertCircle, RefreshCw 
} from 'lucide-react'

// Types
interface VideoSettings {
  resolution: [number, number];
  fps: number;
  duration: number;
  enhanceFrames: boolean;
  style: string;
}

interface EnhancementOptions {
  frameInterpolation: boolean;
  superResolution: boolean;
  colorGrading: string;
  subtitles: boolean;
}

interface VideoJob {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  prompt: string;
  settings: VideoSettings;
  createdAt: Date;
  completedAt?: Date;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

// Sample user data - in production this would come from an auth provider
const SAMPLE_USER = {
  id: 'user-123',
  tier: 'pro', // 'free' or 'pro'
  jobsRemaining: 15, // For free tier users
};

const AuroraVideoSynthDashboard: React.FC = () => {
  // State management
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  const [settings, setSettings] = useState<VideoSettings>({
    resolution: [1920, 1080],
    fps: 30,
    duration: 10,
    enhanceFrames: true,
    style: 'cinematic',
  });
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    frameInterpolation: false,
    superResolution: false,
    colorGrading: 'none',
    subtitles: false,
  });
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [activeJob, setActiveJob] = useState<VideoJob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  // Handle form submission for video generation
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt) {
      alert('Please enter a prompt for video generation');
      return;
    }
    
    setIsGenerating(true);
    
    // In production, this would be an actual API call
    try {
      // Simulate successful job creation
      console.log('Generating video with prompt:', prompt);
      console.log('Settings:', settings);
      
      setTimeout(() => {
        const newJob: VideoJob = {
          id: `job-${Date.now()}`,
          userId: SAMPLE_USER.id,
          status: 'pending',
          prompt,
          settings,
          createdAt: new Date(),
        };
        
        setJobs(prevJobs => [newJob, ...prevJobs]);
        setActiveJob(newJob);
        setIsGenerating(false);
        
        // Simulate job processing
        simulateJobProgress(newJob.id);
      }, 1500);
    } catch (error) {
      console.error('Error generating video:', error);
      setIsGenerating(false);
    }
  };

  // Simulate job status updates
  const simulateJobProgress = (jobId: string) => {
    // Processing stage
    setTimeout(() => {
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, status: 'processing' } : job
      ));
    }, 2000);
    
    // Completion stage (success or failure)
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate for simulation
      
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? {
          ...job,
          status: isSuccess ? 'completed' : 'failed',
          completedAt: new Date(),
          videoUrl: isSuccess ? 'https://example.com/video.mp4' : undefined,
          thumbnailUrl: isSuccess ? 'https://images.unsplash.com/photo-1611162616475-46b635cb6868' : undefined,
          error: isSuccess ? undefined : 'Video generation failed. Please try again.'
        } : job
      ));
      
      // Update active job if it's the one that was processing
      if (activeJob?.id === jobId) {
        setJobs(prevJobs => {
          const updatedJob = prevJobs.find(job => job.id === jobId);
          if (updatedJob) setActiveJob(updatedJob);
          return prevJobs;
        });
      }
    }, 8000);
  };

  // Handle applying enhancements to a video
  const handleEnhanceVideo = async () => {
    if (!activeJob || activeJob.status !== 'completed') return;
    
    setIsEnhancing(true);
    
    // Simulate API call to /api/video/enhance
    console.log('Applying enhancements:', enhancementOptions);
    
    setTimeout(() => {
      setIsEnhancing(false);
      alert('Enhancements applied successfully!');
    }, 3000);
  };

  // Handle file uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImages(Array.from(e.target.files));
    }
  };
  
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedAudio(e.target.files[0]);
    }
  };

  // Handle resolution change
  const handleResolutionChange = (value: string) => {
    const resolutions: Record<string, [number, number]> = {
      '720p': [1280, 720],
      '1080p': [1920, 1080],
      '4k': [3840, 2160]
    };
    
    setSettings(prev => ({
      ...prev,
      resolution: resolutions[value] || [1920, 1080]
    }));
  };

  // Load initial data
  useEffect(() => {
    // Simulating sample jobs for demo
    const sampleJobs: VideoJob[] = [
      {
        id: 'job-1',
        userId: SAMPLE_USER.id,
        status: 'completed',
        prompt: 'Cinematic landscape with mountains, lakes, and flying eagles',
        settings: {
          resolution: [1920, 1080],
          fps: 30,
          duration: 15,
          enhanceFrames: true,
          style: 'cinematic'
        },
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        completedAt: new Date(Date.now() - 86000000), 
        videoUrl: 'https://example.com/video-1.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
      },
      {
        id: 'job-2',
        userId: SAMPLE_USER.id,
        status: 'failed',
        prompt: 'Futuristic cityscape with flying cars and neon lights',
        settings: {
          resolution: [3840, 2160],
          fps: 60,
          duration: 20,
          enhanceFrames: true,
          style: 'sci-fi'
        },
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        completedAt: new Date(Date.now() - 172000000),
        error: 'Processing error: insufficient GPU resources'
      }
    ];
    
    setJobs(sampleJobs);
    setActiveJob(sampleJobs[0]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-40 border-b border-purple-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Aurora Video Synth
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-purple-600 text-xs font-medium">
              {SAMPLE_USER.tier === 'pro' ? 'Pro Tier' : `Free Tier (${SAMPLE_USER.jobsRemaining} videos left)`}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - Input form */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Camera className="mr-2 h-5 w-5 text-purple-400" />
              Generate New Video
            </h2>
            
            <form onSubmit={handleGenerateVideo} className="space-y-5">
              {/* Prompt input */}
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
                  Describe your video
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Cinematic landscape with mountains and lakes, 8K quality, dramatic lighting..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  aria-label="Video description prompt"
                />
              </div>
              
              {/* Media uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Reference Images (Optional)
                  </label>
                  <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 h-24 flex items-center justify-center hover:border-purple-500 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Upload reference images"
                    />
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                      <span className="mt-1 text-xs text-gray-400">
                        {uploadedImages.length ? `${uploadedImages.length} image(s)` : 'Upload images'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Audio Track (Optional)
                  </label>
                  <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 h-24 flex items-center justify-center hover:border-purple-500 transition cursor-pointer">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Upload audio track"
                    />
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-gray-400" />
                      <span className="mt-1 text-xs text-gray-400">
                        {uploadedAudio ? uploadedAudio.name : 'Upload audio'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video settings */}
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-300 flex items-center">
                  <Sliders className="mr-2 h-4 w-4 text-purple-400" />
                  Video Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Resolution */}
                  <div>
                    <label htmlFor="resolution" className="block text-xs text-gray-400 mb-1">
                      Resolution
                    </label>
                    <select
                      id="resolution"
                      value={settings.resolution.join('x')}
                      onChange={(e) => handleResolutionChange(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                      aria-label="Select video resolution"
                    >
                      <option value="720p">HD (1280x720)</option>
                      <option value="1080p">Full HD (1920x1080)</option>
                      <option value="4k">4K (3840x2160)</option>
                    </select>
                  </div>
                  
                  {/* FPS */}
                  <div>
                    <label htmlFor="fps" className="block text-xs text-gray-400 mb-1">
                      Frame Rate (FPS)
                    </label>
                    <select
                      id="fps"
                      value={settings.fps}
                      onChange={(e) => setSettings({...settings, fps: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                      aria-label="Select frame rate"
                    >
                      <option value="24">24 FPS</option>
                      <option value="30">30 FPS</option>
                      <option value="60">60 FPS</option>
                    </select>
                  </div>
                  
                  {/* Duration */}
                  <div>
                    <label htmlFor="duration" className="block text-xs text-gray-400 mb-1">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      min="1"
                      max="60"
                      value={settings.duration}
                      onChange={(e) => setSettings({...settings, duration: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                      aria-label="Set video duration in seconds"
                    />
                  </div>
                  
                  {/* Style */}
                  <div>
                    <label htmlFor="style" className="block text-xs text-gray-400 mb-1">
                      Visual Style
                    </label>
                    <select
                      id="style"
                      value={settings.style}
                      onChange={(e) => setSettings({...settings, style: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                      aria-label="Select visual style"
                    >
                      <option value="cinematic">Cinematic</option>
                      <option value="anime">Anime</option>
                      <option value="3d">3D Realistic</option>
                      <option value="vintage">Vintage Film</option>
                      <option value="sci-fi">Sci-Fi</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Generate button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition"
                aria-label="Generate video"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Generate Video
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Job History */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-purple-400" />
              Job History
            </h2>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {jobs.length === 0 ? (
                <p className="text-gray-400 text-sm">No generation jobs yet.</p>
              ) : (
                jobs.map(job => (
                  <div 
                    key={job.id}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      activeJob?.id === job.id 
                        ? 'bg-purple-900 bg-opacity-40 border border-purple-500' 
                        : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setActiveJob(job)}
                    tabIndex={0}
                    aria-label={`Job: ${job.prompt}`}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveJob(job)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{job.prompt}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-3">
                        {job.status === 'pending' && (
                          <span className="px-2 py-1 rounded-full bg-yellow-700 bg-opacity-30 text-yellow-300 text-xs flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {job.status === 'processing' && (
                          <span className="px-2 py-1 rounded-full bg-blue-700 bg-opacity-30 text-blue-300 text-xs flex items-center">
                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                            Processing
                          </span>
                        )}
                        {job.status === 'completed' && (
                          <span className="px-2 py-1 rounded-full bg-green-700 bg-opacity-30 text-green-300 text-xs flex items-center">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {job.status === 'failed' && (
                          <span className="px-2 py-1 rounded-full bg-red-700 bg-opacity-30 text-red-300 text-xs flex items-center">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        
        {/* Right column - Preview & enhancements */}
        <section className="lg:col-span-7 space-y-6">
          {/* Video preview */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Film className="mr-2 h-5 w-5 text-purple-400" />
              Video Preview
            </h2>
            
            {activeJob ? (
              <>
                <div className="aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  {activeJob.status === 'completed' && activeJob.thumbnailUrl ? (
                    <img 
                      src={activeJob.thumbnailUrl} 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : activeJob.status === 'processing' ? (
                    <div className="text-center p-10">
                      <RefreshCw className="animate-spin h-10 w-10 text-purple-400 mb-2 mx-auto" />
                      <p className="text-gray-300">Processing your video...</p>
                      <p className="text-xs text-gray-400 mt-2">This may take a few minutes</p>
                    </div>
                  ) : activeJob.status === 'failed' ? (
                    <div className="text-center p-10">
                      <AlertCircle className="h-10 w-10 text-red-400 mb-2 mx-auto" />
                      <p className="text-gray-300">Video generation failed</p>
                      <p className="text-xs text-red-400 mt-2">{activeJob.error}</p>
                    </div>
                  ) : (
                    <div className="text-center p-10">
                      <Clock className="h-10 w-10 text-yellow-400 mb-2 mx-auto" />
                      <p className="text-gray-300">Waiting to start processing</p>
                      <p className="text-xs text-gray-400 mt-2">Your job is in the queue</p>
                    </div>
                  )}
                </div>
                
                {/* Job details */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Resolution</p>
                    <p className="text-sm">{activeJob.settings.resolution.join(' x ')}</p>
                  </div>
                  <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm">{activeJob.settings.duration} seconds</p>
                  </div>
                  <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Frame Rate</p>
                    <p className="text-sm">{activeJob.settings.fps} FPS</p>
                  </div>
                  <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Style</p>
                    <p className="text-sm">{activeJob.settings.style}</p>
                  </div>
                </div>
                
                {/* Action buttons */}
                {activeJob.status === 'completed' && (
                  <div className="mt-4 flex space-x-3">
                    <button 
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium flex items-center justify-center text-sm hover:from-purple-700 hover:to-blue-700 transition"
                      aria-label="Download video"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </button>
                    <button 
                      className="py-2 px-4 border border-gray-500 rounded-lg font-medium flex items-center justify-center text-sm hover:bg-gray-700 transition"
                      aria-label="Share video"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <p className="text-gray-400">No video selected</p>
              </div>
            )}
          </div>
          
          {/* Enhancements panel */}
          {activeJob && activeJob.status === 'completed' && (
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Sliders className="mr-2 h-5 w-5 text-purple-400" />
                AI Enhancements
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Frame Interpolation */}
                <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="frameInterpolation"
                        type="checkbox"
                        checked={enhancementOptions.frameInterpolation}
                        onChange={(e) => setEnhancementOptions({
                          ...enhancementOptions,
                          frameInterpolation: e.target.checked
                        })}
                        className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500"
                        aria-label="Enable frame interpolation"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="frameInterpolation" className="text-sm font-medium text-gray-300">
                        Frame Interpolation
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        Smooth slow-motion effects by generating intermediate frames
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Super Resolution */}
                <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="superResolution"
                        type="checkbox"
                        checked={enhancementOptions.superResolution}
                        onChange={(e) => setEnhancementOptions({
                          ...enhancementOptions,
                          superResolution: e.target.checked
                        })}
                        className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500"
                        aria-label="Enable super resolution"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="superResolution" className="text-sm font-medium text-gray-300">
                        Super Resolution
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        Upscale video to 4K with AI enhancement
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Color Grading */}
                <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
                  <label htmlFor="colorGrading" className="block text-sm font-medium text-gray-300 mb-1">
                    Color Grading
                  </label>
                  <select
                    id="colorGrading"
                    value={enhancementOptions.colorGrading}
                    onChange={(e) => setEnhancementOptions({
                      ...enhancementOptions,
                      colorGrading: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                    aria-label="Select color grading style"
                  >
                    <option value="none">None</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="vintage">Vintage Film</option>
                    <option value="scifi">Sci-Fi</option>
                    <option value="anime">Anime</option>
                  </select>
                </div>
                
                {/* Subtitles */}
                <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="subtitles"
                        type="checkbox"
                        checked={enhancementOptions.subtitles}
                        onChange={(e) => setEnhancementOptions({
                          ...enhancementOptions,
                          subtitles: e.target.checked
                        })}
                        className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500"
                        aria-label="Enable subtitles"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="subtitles" className="text-sm font-medium text-gray-300">
                        Subtitle Overlay
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        Generate AI-powered captions from audio
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Apply enhancements button */}
              <button
                onClick={handleEnhanceVideo}
                disabled={isEnhancing}
                className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-600 hover:to-emerald-600 transition"
                aria-label="Apply enhancements"
              >
                {isEnhancing ? (
                  <>
                    <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                    Applying Enhancements...
                  </>
                ) : (
                  <>
                    <Sliders className="mr-2 h-5 w-5" />
                    Apply Enhancements
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      </main>
      
      {/* Usage stats footer */}
      <footer className="bg-black bg-opacity-40 border-t border-purple-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <span>Aurora Video Synth</span>
              <span className="mx-2">•</span>
              <span>{SAMPLE_USER.tier === 'pro' ? 'Pro Account' : 'Free Account'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-400">Processing Time:</span>
                <span className="ml-2 text-purple-400 font-medium">~2-5 min per video</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">API Usage:</span>
                <span className="ml-2 text-purple-400 font-medium">32/500 requests</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Storage:</span>
                <span className="ml-2 text-purple-400 font-medium">128 MB / 5 GB</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
// First, let's refine the AuroraVideoSynthDashboard.tsx with the new features

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Camera, Upload, Image as ImageIcon, Film, 
  Sliders, Play, Download, Share2, Clock, 
  CheckCircle, AlertCircle, RefreshCw, Music,
  Layers, Move, Crop, Settings, Award, Sparkles,
  Clapperboard, Palette, Volume2, Droplets
} from 'lucide-react'

// Enhanced Types
interface VideoSettings {
  resolution: [number, number];
  fps: number;
  duration: number;
  enhanceFrames: boolean;
  style: string;
  sceneType?: string;
  cameraMotion?: string;
  focusPoint?: string;
}

interface Scene {
  id: string;
  prompt: string;
  duration: number;
  sceneType: string;
  cameraMotion: string;
}

interface TransitionType {
  id: string;
  name: string;
  value: string;
}

interface EnhancementOptions {
  frameInterpolation: boolean;
  superResolution: boolean;
  colorGrading: string;
  subtitles: boolean;
  aiSoundtrack?: string;
  autoThumbnail?: boolean;
  autoTitle?: boolean;
}

interface VideoJob {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  prompt: string;
  settings: VideoSettings;
  scenes?: Scene[];
  transitions?: string[];
  createdAt: Date;
  completedAt?: Date;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  progress?: number;
  estimatedTimeRemaining?: string;
  generatedTitles?: string[];
  selectedTitle?: string;
}

// Available scene types
const SCENE_TYPES = [
  { id: 'default', name: 'Standard', value: 'default' },
  { id: 'cyberpunk', name: 'Cyberpunk City', value: 'cyberpunk' },
  { id: 'fantasy', name: 'Fantasy Landscape', value: 'fantasy' },
  { id: 'realistic', name: 'Realistic Outdoor', value: 'realistic' },
  { id: 'scifi', name: 'Sci-Fi Interior', value: 'scifi' }
];

// Available camera motions
const CAMERA_MOTIONS = [
  { id: 'static', name: 'Static Shot', value: 'static' },
  { id: 'pan_left', name: 'Pan Left', value: 'pan_left' },
  { id: 'pan_right', name: 'Pan Right', value: 'pan_right' },
  { id: 'zoom_in', name: 'Zoom In', value: 'zoom_in' },
  { id: 'zoom_out', name: 'Zoom Out', value: 'zoom_out' },
  { id: 'tracking', name: 'AI Tracking Shot', value: 'tracking' }
];

// Available transition types
const TRANSITION_TYPES: TransitionType[] = [
  { id: 'fade', name: 'Fade', value: 'fade' },
  { id: 'slide', name: 'Slide', value: 'slide' },
  { id: 'dissolve', name: 'Dissolve', value: 'dissolve' },
  { id: 'glitch', name: 'Glitch', value: 'glitch' },
  { id: 'whip', name: 'Whip', value: 'whip' }
];

// Available soundtrack types
const SOUNDTRACK_TYPES = [
  { id: 'none', name: 'None', value: 'none' },
  { id: 'cinematic', name: 'Cinematic', value: 'cinematic' },
  { id: 'electronic', name: 'Electronic', value: 'electronic' },
  { id: 'orchestral', name: 'Orchestral', value: 'orchestral' },
  { id: 'ambient', name: 'Ambient', value: 'ambient' }
];

// Sample user data - in production this would come from an auth provider
const SAMPLE_USER = {
  id: 'user-123',
  tier: 'pro', // 'free' or 'pro'
  jobsRemaining: 15, // For free tier users
};

type TabType = 'generate' | 'enhance' | 'multi-shot' | 'audio' | 'batch';

const AuroraVideoSynthDashboard: React.FC = () => {
  const router = useRouter();
  
  // State management
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  const [settings, setSettings] = useState<VideoSettings>({
    resolution: [1920, 1080],
    fps: 30,
    duration: 10,
    enhanceFrames: true,
    style: 'cinematic',
    sceneType: 'default',
    cameraMotion: 'static',
  });
  
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    frameInterpolation: false,
    superResolution: false,
    colorGrading: 'none',
    subtitles: false,
    aiSoundtrack: 'none',
    autoThumbnail: true,
    autoTitle: true,
  });
  
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [transitions, setTransitions] = useState<string[]>([]);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(-1);
  const [selectedBatchJobs, setSelectedBatchJobs] = useState<string[]>([]);
  
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [activeJob, setActiveJob] = useState<VideoJob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);
  
  // AI-generated title suggestions
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number>(-1);
  
  // Video editing state
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(50);
  const [contrast, setContrast] = useState<number>(50);

  // Handle form submission for video generation
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt) {
      alert('Please enter a prompt for video generation');
      return;
    }
    
    setIsGenerating(true);
    
    // In production, this would be an actual API call to the Edge Function
    try {
      // Prepare payload based on active tab
      let payload: any = {};
      
      if (activeTab === 'generate') {
        // Single video generation
        payload = {
          prompt,
          userId: SAMPLE_USER.id,
          settings: {
            ...settings,
            scene_type: settings.sceneType,
            camera_motion: settings.cameraMotion,
          }
        };
      } else if (activeTab === 'multi-shot') {
        // Multi-shot video generation
        payload = {
          userId: SAMPLE_USER.id,
          scenes: scenes.map(scene => ({
            prompt: scene.prompt,
            duration: scene.duration,
            scene_type: scene.sceneType,
            camera_motion: scene.cameraMotion
          })),
          transitions,
          settings: {
            resolution: settings.resolution,
            fps: settings.fps,
            enhanceFrames: settings.enhanceFrames,
            style: settings.style
          }
        };
      }
      
      console.log('Generating video with payload:', payload);
      
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        // Create a new job
        const newJob: VideoJob = {
          id: `job-${Date.now()}`,
          userId: SAMPLE_USER.id,
          status: 'pending',
          prompt: activeTab === 'generate' ? prompt : 'Multi-shot sequence',
          settings: settings,
          scenes: activeTab === 'multi-shot' ? scenes : undefined,
          transitions: activeTab === 'multi-shot' ? transitions : undefined,
          createdAt: new Date(),
        };
        
        setJobs(prevJobs => [newJob, ...prevJobs]);
        setActiveJob(newJob);
        setIsGenerating(false);
        
        // Simulate job processing
        simulateJobProgress(newJob.id);
      }, 1500);
    } catch (error) {
      console.error('Error generating video:', error);
      setIsGenerating(false);
    }
  };

  // Simulate job status updates
  const simulateJobProgress = (jobId: string) => {
    // Initial progress tracking
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += Math.floor(Math.random() * 5) + 1;
        setJobs(prevJobs => prevJobs.map(job => 
          job.id === jobId ? { 
            ...job, 
            status: 'processing',
            progress: currentProgress,
            estimatedTimeRemaining: `${Math.ceil((90 - currentProgress) / 10)} minutes`
          } : job
        ));
      } else {
        clearInterval(progressInterval);
      }
    }, 2000);
    
    // Processing stage
    setTimeout(() => {
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, status: 'processing' } : job
      ));
    }, 2000);
    
    // Completion stage (success or failure)
    setTimeout(() => {
      clearInterval(progressInterval);
      const isSuccess = Math.random() > 0.2; // 80% success rate for simulation
      
      const generatedTitles = isSuccess ? [
        'Futuristic Cybernetic Vision',
        'Digital Dreams in Motion',
        'Neon Cascade Adventure',
        'Immersive Visual Journey'
      ] : undefined;
      
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? {
          ...job,
          status: isSuccess ? 'completed' : 'failed',
          completedAt: new Date(),
          videoUrl: isSuccess ? 'https://example.com/video.mp4' : undefined,
          thumbnailUrl: isSuccess ? 'https://images.unsplash.com/photo-1611162616475-46b635cb6868' : undefined,
          error: isSuccess ? undefined : 'Video generation failed. Please try again.',
          progress: isSuccess ? 100 : undefined,
          estimatedTimeRemaining: undefined,
          generatedTitles,
          selectedTitle: generatedTitles ? generatedTitles[0] : undefined
        } : job
      ));
      
      // Update active job if it's the one that was processing
      if (activeJob?.id === jobId) {
        setJobs(prevJobs => {
          const updatedJob = prevJobs.find(job => job.id === jobId);
          if (updatedJob) setActiveJob(updatedJob);
          return prevJobs;
        });
      }
      
      // Set title suggestions if job completed successfully
      if (isSuccess) {
        setTitleSuggestions(generatedTitles || []);
        setSelectedTitleIndex(0);
      }
    }, 10000);
  };

  // Handle applying enhancements to a video
  const handleEnhanceVideo = async () => {
    if (!activeJob || activeJob.status !== 'completed') return;
    
    setIsEnhancing(true);
    
    // In production, this would call the enhancement API
    // Example: POST /api/video/enhance
    console.log('Applying enhancements:', enhancementOptions);
    
    const enhancementPayload = {
      jobId: activeJob.id,
      userId: SAMPLE_USER.id,
      enhancementOptions: {
        ...enhancementOptions,
        trimStart,
        trimEnd,
        brightness,
        contrast
      }
    };
    
    console.log('Enhancement payload:', enhancementPayload);
    
    setTimeout(() => {
      setIsEnhancing(false);
      alert('Enhancements applied successfully!');
      
      // Update job with enhanced status
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === activeJob.id ? {
          ...job,
          thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', // Update with enhanced thumbnail
        } : job
      ));
    }, 3000);
  };

  // Handle batch processing
  const handleBatchProcess = async () => {
    if (selectedBatchJobs.length === 0) {
      alert('Please select at least one job to process');
      return;
    }
    
    setIsBatchProcessing(true);
    
    // In production, this would call the batch processing API
    // Example: POST /api/video/batch_process
    console.log('Batch processing jobs:', selectedBatchJobs);
    
    setTimeout(() => {
      setIsBatchProcessing(false);
      alert(`Batch processing started for ${selectedBatchJobs.length} jobs`);
      setSelectedBatchJobs([]);
    }, 2000);
  };

  // Handle adding a new scene for multi-shot
  const handleAddScene = () => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      prompt: '',
      duration: 5,
      sceneType: 'default',
      cameraMotion: 'static'
    };
    
    setScenes(prevScenes => [...prevScenes, newScene]);
    setSelectedSceneIndex(scenes.length);
    
    // Add a transition if there's more than one scene
    if (scenes.length > 0) {
      setTransitions(prevTransitions => [...prevTransitions, 'fade']);
    }
  };

  // Handle updating a scene
  const handleSceneUpdate = (index: number, field: keyof Scene, value: string | number) => {
    setScenes(prevScenes => 
      prevScenes.map((scene, i) => 
        i === index ? { ...scene, [field]: value } : scene
      )
    );
  };

  // Handle removing a scene
  const handleRemoveScene = (index: number) => {
    setScenes(prevScenes => prevScenes.filter((_, i) => i !== index));
    
    // Remove corresponding transition
    if (index < transitions.length) {
      setTransitions(prevTransitions => 
        prevTransitions.filter((_, i) => i !== index)
      );
    }
    
    // Update selected scene index
    if (selectedSceneIndex === index) {
      setSelectedSceneIndex(-1);
    } else if (selectedSceneIndex > index) {
      setSelectedSceneIndex(selectedSceneIndex - 1);
    }
  };

  // Handle reordering scenes (simplified - would use a drag-and-drop library in production)
  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === scenes.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    setScenes(prevScenes => {
      const newScenes = [...prevScenes];
      const [movedScene] = newScenes.splice(index, 1);
      newScenes.splice(newIndex, 0, movedScene);
      return newScenes;
    });
    
    // Move corresponding transition
    if (index < transitions.length) {
      setTransitions(prevTransitions => {
        const newTransitions = [...prevTransitions];
        const [movedTransition] = newTransitions.splice(index, 1);
        newTransitions.splice(newIndex, 0, movedTransition);
        return newTransitions;
      });
    }
    
    // Update selected scene index
    if (selectedSceneIndex === index) {
      setSelectedSceneIndex(newIndex);
    } else if (selectedSceneIndex === newIndex) {
      setSelectedSceneIndex(index);
    }
  };

  // Handle updating a transition
  const handleTransitionUpdate = (index: number, value: string) => {
    setTransitions(prevTransitions => 
      prevTransitions.map((transition, i) => 
        i === index ? value : transition
      )
    );
  };

  // Handle file uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImages(Array.from(e.target.files));
    }
  };
  
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedAudio(e.target.files[0]);
    }
  };

  // Handle resolution change
  const handleResolutionChange = (value: string) => {
    const resolutions: Record<string, [number, number]> = {
      '720p': [1280, 720],
      '1080p': [1920, 1080],
      '4k': [3840, 2160]
    };
    
    setSettings(prev => ({
      ...prev,
      resolution: resolutions[value] || [1920, 1080]
    }));
  };

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Handle selecting a title from AI suggestions
  const handleSelectTitle = (index: number) => {
    if (!activeJob || !activeJob.generatedTitles) return;
    
    setSelectedTitleIndex(index);
    const selectedTitle = activeJob.generatedTitles[index];
    
    // Update job with selected title
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === activeJob.id ? {
        ...job,
        selectedTitle
      } : job
    ));
    
    // Update active job
    setActiveJob(prev => prev ? {
      ...prev,
      selectedTitle
    } : null);
  };

  // Toggle batch job selection
  const handleToggleBatchJob = (jobId: string) => {
    setSelectedBatchJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  // Load initial data
  useEffect(() => {
    // In production, this would fetch from the Supabase database via Edge Function
    // Simulating sample jobs for demo
    const sampleJobs: VideoJob[] = [
      {
        id: 'job-1',
        userId: SAMPLE_USER.id,
        status: 'completed',
        prompt: 'Cinematic landscape with mountains, lakes, and flying eagles',
        settings: {
          resolution: [1920, 1080],
          fps: 30,
          duration: 15,
          enhanceFrames: true,
          style: 'cinematic',
          sceneType: 'realistic',
          cameraMotion: 'pan_right'
        },
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        completedAt: new Date(Date.now() - 86000000), 
        videoUrl: 'https://example.com/video-1.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        generatedTitles: [
          'Majestic Mountain Flythrough',
          'Nature\'s Grandeur',
          'Wilderness Vista',
          'Eagle\'s View'
        ],
        selectedTitle: 'Majestic Mountain Flythrough'
      },
      {
        id: 'job-2',
        userId: SAMPLE_USER.id,
        status: 'failed',
        prompt: 'Futuristic cityscape with flying cars and neon lights',
        settings: {
          resolution: [3840, 2160],
          fps: 60,
          duration: 20,
          enhanceFrames: true,
          style: 'sci-fi',
          sceneType: 'cyberpunk',
          cameraMotion: 'tracking'
        },
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        completedAt: new Date(Date.now() - 172000000),
        error: 'Processing error: insufficient GPU resources'
      }
    ];
    
    setJobs(sampleJobs);
    setActiveJob(sampleJobs[0]);
    
    // If there's a completed job with title suggestions, set them
    const completedJob = sampleJobs.find(job => job.status === 'completed' && job.generatedTitles);
    if (completedJob && completedJob.generatedTitles) {
      setTitleSuggestions(completedJob.generatedTitles);
      setSelectedTitleIndex(completedJob.generatedTitles.indexOf(completedJob.selectedTitle || ''));
    }
  }, []);

  // Component for the basic generation tab
  const GenerateTab = () => (
    <div className="space-y-5">
      <form onSubmit={handleGenerateVideo} className="space-y-5">
        {/* Prompt input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
            Describe your video
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Cinematic landscape with mountains and lakes, 8K quality, dramatic lighting..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            aria-label="Video description prompt"
          />
        </div>
        
        {/* Media uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Reference Images (Optional)
            </label>
            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 h-24 flex items-center justify-center hover:border-purple-500 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload reference images"
              />
              <div className="text-center">
                <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-400">
                  {uploadedImages.length ? `${uploadedImages.length} image(s)` : 'Upload images'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Audio Track (Optional)
            </label>
            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 h-24 flex items-center justify-center hover:border-purple-500 transition cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload audio track"
              />
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-400">
                  {uploadedAudio ? uploadedAudio.name : 'Upload audio'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI-Powered Scene Customization */}
        <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Palette className="mr-2 h-4 w-4 text-purple-400" />
            AI Scene Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scene Type */}
            <div>
              <label htmlFor="sceneType" className="block text-xs text-gray-400 mb-1">
                Scene Type
              </label>
              <select
                id="sceneType"
                value={settings.sceneType}
                onChange={(e) => setSettings({...settings, sceneType: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                aria-label="Select scene type"
              >
                {SCENE_TYPES.map(type => (
                  <option key={type.id} value={type.value}>{type.name}</option>
                ))}
              </select>
            </div>
            
            {/* Camera Motion */}
            <div>
              <label htmlFor="cameraMotion" className="block text-xs text-gray-400 mb-1">
                Camera Motion
              </label>
              <select
                id="cameraMotion"
                value={settings.cameraMotion}
                onChange={(e) => setSettings({...settings, cameraMotion: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                aria-label="Select camera motion"
              >
                {CAMERA_MOTIONS.map(motion => (
                  <option key={motion.id} value={motion.value}>{motion.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Video settings */}
        <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Sliders className="mr-2 h-4 w-4 text-purple-400" />
            Video Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resolution */}
            <div>
              <label htmlFor="resolution" className="block text-xs text-gray-400 mb-1">
                Resolution
              </label>
              <select
                id="resolution"
                value={
                  settings.resolution[0] === 1280 ? '720p' :
                  settings.resolution[0] === 1920 ? '1080p' :
                  settings.resolution[0] === 3840 ? '4k' : '1080p'
                }
                onChange={(e) => handleResolutionChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                aria-label="Select video resolution"
              >
                <option value="720p">HD (1280x720)</option>
                <option value="1080p">Full HD (1920x1080)</option>
                <option value="4k">4K (3840x2160)</option>
              </select>
            </div>
            
            {/* FPS */}
            <div>
              <label htmlFor="fps" className="block text-xs text-gray-400 mb-1">
                Frame Rate (FPS)
              </label>
              <select
                id="fps"
                value={settings.fps}
                onChange={(e) => setSettings({...settings, fps: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                aria-label="Select frame rate"
              >
                <option value="24">24 FPS</option>
                <option value="30">30 FPS</option>
                <option value="60">60 FPS</option>
              </select>
            </div>
            
            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-xs text-gray-400 mb-1">
                Duration (seconds)
              </label>
              <input
                type="number"
                id="duration"
                min="1"
                max="60"
                value={settings.duration}
                onChange={(e) => setSettings({...settings, duration: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                aria-label="Set video duration in seconds"
              />
            </div>
            
            {/* Style */}
            <div>
              <label htmlFor="style" className="block text-xs text-gray-400 mb-1">
                Visual Style
              </label>
              <select
                id="style"
                value={settings.style}
                onChange={(e) => setSettings({...settings, style: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                aria-label="Select visual style"
              >
                <option value="cinematic">Cinematic</option>
                <option value="anime">Anime</option>
                <option value="3d">3D Realistic</option>
                <option value="vintage">Vintage Film</option>
                <option value="sci-fi">Sci-Fi</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Generate button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition"
          aria-label="Generate video"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin mr-2 h-5 w-5" />
              Generating...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Generate Video
            </>
          )}
        </button>
      </form>
    </div>
  );

  // Component for multi-shot storyboarding
  const MultiShotTab = () => (
    <div className="space-y-5">
      {/* Scene list */}
      <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Layers className="mr-2 h-4 w-4 text-purple-400" />
            Scene Storyboard
          </h3>
          <button
            type="button"
            onClick={handleAddScene}
            className="px-3 py-1 bg-purple-600 rounded-md text-xs font-medium hover:bg-purple-700 transition flex items-center"
            aria-label="Add new scene"
          >
            <Clapperboard className="mr-1 h-3 w-3" />
            Add Scene
          </button>
        </div>
        
        {scenes.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm">
              No scenes added yet. Add your first scene to begin creating a multi-shot video.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scenes.map((scene, index) => (
              <div key={scene.id} className="relative">
                <div 
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedSceneIndex === index 
                      ? 'bg-purple-900 bg-opacity-40 border border-purple-500' 
                      : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedSceneIndex(index)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedSceneIndex(index)}
                  aria-label={`Scene ${index + 1}`}
                >
                  <div className="flex justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {`Scene ${index + 1}: ${scene.prompt || 'No prompt yet'}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {`${scene.duration}s - ${SCENE_TYPES.find(t => t.value === scene.sceneType)?.name} - ${CAMERA_MOTIONS.find(m => m.value === scene.cameraMotion)?.name}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveScene(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move scene up"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveScene(index, 'down');
                        }}
                        disabled={index === scenes.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move scene down"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveScene(index);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                        aria-label="Remove scene"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Transition indicator (between scenes) */}
                {index < scenes.length - 1 && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <select
                      value={transitions[index] || 'fade'}
                      onChange={(e) => handleTransitionUpdate(index, e.target.value)}
                      className="mx-2 px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded-md"
                      aria-label={`Transition between scene ${index + 1} and ${index + 2}`}
                    >
                      {TRANSITION_TYPES.map(type => (
                        <option key={type.id} value={type.value}>{type.name}</option>
                      ))}
                    </select>
                    <div className="flex-1 h-px bg-gray-700"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Scene editor */}
      {selectedSceneIndex >= 0 && selectedSceneIndex < scenes.length && (
        <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Edit Scene {selectedSceneIndex + 1}</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="scenePrompt" className="block text-xs text-gray-400 mb-1">
                Scene Description
              </label>
              <textarea
                id="scenePrompt"
                rows={3}
                value={scenes[selectedSceneIndex].prompt}
                onChange={(e) => handleSceneUpdate(selectedSceneIndex, 'prompt', e.target.value)}
                placeholder="Describe this scene..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                aria-label="Scene description"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="sceneDuration" className="block text-xs text-gray-400 mb-1">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  id="sceneDuration"
                  min="1"
                  max="30"
                  value={scenes[selectedSceneIndex].duration}
                  onChange={(e) => handleSceneUpdate(selectedSceneIndex, 'duration', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                  aria-label="Scene duration"
                />
              </div>
              
              <div>
                <label htmlFor="sceneType" className="block text-xs text-gray-400 mb-1">
                  Scene Type
                </label>
                <select
                  id="sceneType"
                  value={scenes[selectedSceneIndex].sceneType}
                  onChange={(e) => handleSceneUpdate(selectedSceneIndex, 'sceneType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                  aria-label="Scene type"
                >
                  {SCENE_TYPES.map(type => (
                    <option key={type.id} value={type.value}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="cameraMotion" className="block text-xs text-gray-400 mb-1">
                  Camera Motion
                </label>
                <select
                  id="cameraMotion"
                  value={scenes[selectedSceneIndex].cameraMotion}
                  onChange={(e) => handleSceneUpdate(selectedSceneIndex, 'cameraMotion', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                  aria-label="Camera motion"
                >
                  {CAMERA_MOTIONS.map(motion => (
                    <option key={motion.id} value={motion.value}>{motion.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Video settings (same as single generation) */}
      <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-gray-300 flex items-center">
          <Sliders className="mr-2 h-4 w-4 text-purple-400" />
          Global Video Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Resolution */}
          <div>
            <label htmlFor="msResolution" className="block text-xs text-gray-400 mb-1">
              Resolution
            </label>
            <select
              id="msResolution"
              value={
                settings.resolution[0] === 1280 ? '720p' :
                settings.resolution[0] === 1920 ? '1080p' :
                settings.resolution[0] === 3840 ? '4k' : '1080p'
              }
              onChange={(e) => handleResolutionChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
              aria-label="Select video resolution"
            >
              <option value="720p">HD (1280x720)</option>
              <option value="1080p">Full HD (1920x1080)</option>
              <option value="4k">4K (3840x2160)</option>
            </select>
          </div>
          
          {/* FPS */}
          <div>
            <label htmlFor="msFps" className="block text-xs text-gray-400 mb-1">
              Frame Rate (FPS)
            </label>
            <select
              id="msFps"
              value={settings.fps}
              onChange={(e) => setSettings({...settings, fps: Number(e.target.value)})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
              aria-label="Select frame rate"
            >
              <option value="24">24 FPS</option>
              <option value="30">30 FPS</option>
              <option value="60">60 FPS</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Generate multi-shot video button */}
      <button
        type="button"
        onClick={handleGenerateVideo}
        disabled={isGenerating || scenes.length === 0}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition"
        aria-label="Generate multi-shot video"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="animate-spin mr-2 h-5 w-5" />
            Generating Multi-Shot Video...
          </>
        ) : (
          <>
            <Layers className="mr-2 h-5 w-5" />
            Generate Multi-Shot Video
          </>
        )}
      </button>
    </div>
  );

  // Component for the enhance tab
  const EnhanceTab = () => {
    if (!activeJob) {
      return (
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
          <p className="text-center text-gray-400">Please select a completed video from the job history to enhance</p>
        </div>
      );
    }

    if (activeJob.status !== 'completed') {
      return (
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
          <p className="text-center text-gray-400">Selected video must be completed before it can be enhanced</p>
          <p className="text-center text-gray-500 text-sm mt-1">Current status: {activeJob.status}</p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {/* Video editing controls */}
        <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Crop className="mr-2 h-4 w-4 text-teal-400" />
            Video Editing
          </h3>
          
          {/* Trim controls */}
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">
              Trim Video
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={trimStart}
                onChange={(e) => setTrimStart(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-label="Trim start position"
              />
              <span className="text-xs">{trimStart}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={trimEnd}
                onChange={(e) => setTrimEnd(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-label="Trim end position"
              />
              <span className="text-xs">{trimEnd}%</span>
            </div>
          </div>
          
          {/* Brightness/Contrast controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">
                Brightness
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Brightness adjustment"
                />
                <span className="text-xs">{brightness}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">
                Contrast
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Contrast adjustment"
                />
                <span className="text-xs">{contrast}%</span>
              </div>
            </div>
          </div>
          
          {/* Auto-enhance button */}
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 transition rounded-md text-sm font-medium flex items-center justify-center"
            aria-label="Auto-enhance video"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Auto-Enhance
          </button>
        </div>
        
        {/* AI Enhancements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Frame Interpolation */}
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="frameInterpolation"
                  type="checkbox"
                  checked={enhancementOptions.frameInterpolation}
                  onChange={(e) => setEnhancementOptions({
                    ...enhancementOptions,
                    frameInterpolation: e.target.checked
                  })}
                  className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500"
                  aria-label="Enable frame interpolation"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="frameInterpolation" className="text-sm font-medium text-gray-300">
                  Frame Interpolation
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Smooth slow-motion effects by generating intermediate frames
                </p>
              </div>
            </div>
          </div>
          
          {/* Super Resolution */}
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="superResolution"
                  type="checkbox"
                  checked={enhancementOptions.superResolution}
                  onChange={(e) => setEnhancementOptions({
                    ...enhancementOptions,
                    superResolution: e.target.checked
                  })}
                  className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500"
                  aria-label="Enable super resolution"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="superResolution" className="text-sm font-medium text-gray-300">
                  Super Resolution
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Upscale video to 4K with AI enhancement
                </p>
              </div>
            </div>
          </div>
          
          {/* Color Grading */}
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
            <label htmlFor="colorGrading" className="block text-sm font-medium text-gray-300 mb-1">
              Color Grading
            </label>
            <select
              id="colorGrading"
              value={enhancementOptions.colorGrading}
              onChange={(e) => setEnhancementOptions({
                ...enhancementOptions,
                colorGrading: e.target.value
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
              aria-label="Select color grading style"
            >
              <option value="none">None</option>
              <option value="cinematic">Cinematic</option>
              <option value="vintage">Vintage Film</option>
              <option value="scifi">Sci-Fi</option>
              <option value="anime">Anime</option>
            </select>
          </div>
          
          {/* Subtitles */}
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="subtitles"
                  type="checkbox"
                  checked={enhancementOptions.subtitles}
                  onChange={(e) => setEnhancementOptions({
                    ...enhancementOptions,
                    subtitles: e.target.checked
                  })}
                  className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500"
                  aria-label="Enable subtitles"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="subtitles" className="text-sm font-medium text-gray-300">
                  Subtitle Overlay
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Generate AI-powered captions from audio
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Auto-generated Thumbnails & Titles */}
        <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <ImageIcon className="mr-2 h-4 w-4 text-teal-400" />
            AI-Generated Thumbnails & Titles
          </h3>
          
          {/* Title suggestions */}
          {activeJob.generatedTitles && activeJob.generatedTitles.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">
                Title Suggestions
              </label>
              <div className="space-y-2">
                {activeJob.generatedTitles.map((title, idx) => (
                  <div 
                    key={idx}
                    className={`p-2 rounded-lg cursor-pointer border ${
                      idx === selectedTitleIndex 
                        ? 'bg-teal-900 bg-opacity-30 border-teal-500' 
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => handleSelectTitle(idx)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectTitle(idx)}
                    aria-label={`Select title: ${title}`}
                  >
                    <p className="text-sm">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Auto-thumbnail options */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="autoThumbnail"
                type="checkbox"
                checked={enhancementOptions.autoThumbnail}
                onChange={(e) => setEnhancementOptions({
                  ...enhancementOptions,
                  autoThumbnail: e.target.checked
                })}
                className="h-4 w-4 text-teal-600 rounded border-gray-700 focus:ring-teal-500"
                aria-label="Enable auto-generated thumbnails"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="autoThumbnail" className="text-sm font-medium text-gray-300">
                Auto-Generate Thumbnails
              </label>
              <p className="text-xs text-gray-400 mt-1">
                AI selects the best frame for your thumbnail
              </p>
            </div>
          </div>
        </div>
        
        {/* Audio options */}
        <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Volume2 className="mr-2 h-4 w-4 text-teal-400" />
            Audio Enhancement
          </h3>
          
          <div className="space-y-2">
            <label htmlFor="aiSoundtrack" className="block text-xs text-gray-400">
              AI-Generated Soundtrack
            </label>
            <select
              id="aiSoundtrack"
              value={enhancementOptions.aiSoundtrack}
              onChange={(e) => setEnhancementOptions({
                ...enhancementOptions,
                aiSoundtrack: e.target.value
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
              aria-label="Select AI soundtrack type"
            >
              {SOUNDTRACK_TYPES.map(type => (
                <option key={type.id} value={type.value}>{type.name}</option>
              ))}
            </select>
          </div>
          
          {/* Audio upload */}
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">
              Custom Audio (Optional)
            </label>
            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-3 h-16 flex items-center justify-center hover:border-teal-500 transition cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload custom audio track"
              />
              <div className="text-center flex items-center">
                <Music className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-xs text-gray-400">
                  {uploadedAudio ? uploadedAudio.name : 'Upload custom audio'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Apply enhancements button */}
        <button
          onClick={handleEnhanceVideo}
          disabled={isEnhancing}
          className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-600 hover:to-emerald-600 transition"
          aria-label="Apply enhancements"
        >
          {isEnhancing ? (
            <>
              <RefreshCw className="animate-spin mr-2 h-5 w-5" />
              Applying Enhancements...
            </>
          ) : (
            <>
              <Sliders className="mr-2 h-5 w-5" />
              Apply Enhancements
            </>
          )}
        </button>
      </div>
    );
  };

  // Component for the batch processing tab
  const BatchTab = () => {
    // Only show completed jobs for batch processing
    const completedJobs = jobs.filter(job => job.status === 'completed');
    
    return (
      <div className="space-y-5">
        <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Settings className="mr-2 h-4 w-4 text-purple-400" />
            Batch Processing (Pro Feature)
          </h3>
          
          {SAMPLE_USER.tier !== 'pro' ? (
            <div className="text-center p-6 border border-dashed border-yellow-800 bg-yellow-900 bg-opacity-20 rounded-lg">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-300 font-medium">Pro Feature</p>
              <p className="text-gray-400 text-sm mt-1">
                Upgrade to Pro tier to unlock batch processing
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition rounded-md text-sm font-medium"
                aria-label="Upgrade to Pro"
              >
                Upgrade to Pro
              </button>
            </div>
          ) : (
            <>
              {completedJobs.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-gray-700 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    No completed videos available for batch processing
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {completedJobs.map(job => (
                      <div 
                        key={job.id}
                        className="flex items-center p-3 rounded-lg bg-gray-800 border border-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBatchJobs.includes(job.id)}
                          onChange={() => handleToggleBatchJob(job.id)}
                          className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500 mr-3"
                          aria-label={`Select job: ${job.prompt}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{job.prompt}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(job.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {job.thumbnailUrl && (
                          <div className="ml-3 h-12 w-20 rounded overflow-hidden">
                            <img 
                              src={job.thumbnailUrl}
                              alt="Video thumbnail"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                    <h4 className="text-xs font-medium text-gray-300">Batch Actions</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="batchColorGrading" className="block text-xs text-gray-400 mb-1">
                          Apply Color Grading
                        </label>
                        <select
                          id="batchColorGrading"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
                          aria-label="Select batch color grading"
                        >
                          <option value="none">None</option>
                          <option value="cinematic">Cinematic</option>
                          <option value="vintage">Vintage Film</option>
                          <option value="scifi">Sci-Fi</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="batchResolution" className="block text-xs text-gray-400 mb-1">
                          Upscale Resolution
                        </label>
                        <select
                          id="batchResolution"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
                          aria-label="Select batch resolution"
                        >
                          <option value="none">Keep Original</option>
                          <option value="720p">720p</option>
                          <option value="1080p">1080p</option>
                          <option value="4k">4K</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleBatchProcess}
                    disabled={isBatchProcessing || selectedBatchJobs.length === 0}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition"
                    aria-label="Process selected jobs"
                  >
                    {isBatchProcessing ? (
                      <>
                        <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                        Processing Batch...
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-5 w-5" />
                        Process {selectedBatchJobs.length} Selected Videos
                      </>
                    )}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-40 border-b border-purple-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Aurora Video Synth
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-purple-600 text-xs font-medium">
              {SAMPLE_USER.tier === 'pro' ? 'Pro Tier' : `Free Tier (${SAMPLE_USER.jobsRemaining} videos left)`}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - Input form */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
            {/* Tab navigation */}
            <div className="flex flex-wrap mb-6 border-b border-gray-700">
              <button
                onClick={() => handleTabChange('generate')}
                className={`px-4 py-2 font-medium flex items-center ${
                  activeTab === 'generate'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                aria-selected={activeTab === 'generate'}
                role="tab"
                tabIndex={0}
              >
                <Camera className="mr-2 h-5 w-5" />
                Generate
              </button>
              <button
                onClick={() => handleTabChange('multi-shot')}
                className={`px-4 py-2 font-medium flex items-center ${
                  activeTab === 'multi-shot'
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                aria-selected={activeTab === 'multi-shot'}
                role="tab"
                tabIndex={0}
              >
                <Layers className="mr-2 h-5 w-5" />
                Multi-Shot
              </button>
              <button
                onClick={() => handleTabChange('enhance')}
                className={`px-4 py-2 font-medium flex items-center ${
                  activeTab === 'enhance'
                    ? 'text-teal-400 border-b-2 border-teal-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                aria-selected={activeTab === 'enhance'}
                role="tab"
                tabIndex={0}
              >
                <Sliders className="mr-2 h-5 w-5" />
                Enhance
              </button>
              <button
                onClick={() => handleTabChange('batch')}
                className={`px-4 py-2 font-medium flex items-center ${
                  activeTab === 'batch'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                aria-selected={activeTab === 'batch'}
                role="tab"
                tabIndex={0}
              >
                <Settings className="mr-2 h-5 w-5" />
                Batch
              </button>
            </div>
            
            {/* Tab content */}
            {activeTab === 'generate' && <GenerateTab />}
            {activeTab === 'multi-shot' && <MultiShotTab />}
            {activeTab === 'enhance' && <EnhanceTab />}
            {activeTab === 'batch' && <BatchTab />}
          </div>
          
          {/* Job History */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-purple-400" />
              Job History
            </h2>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {jobs.length === 0 ? (
                <p className="text-gray-400 text-sm">No generation jobs yet.</p>
              ) : (
                jobs.map(job => (
                  <div 
                    key={job.id}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      activeJob?.id === job.id 
                        ? 'bg-purple-900 bg-opacity-40 border border-purple-500' 
                        : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setActiveJob(job)}
                    tabIndex={0}
                    aria-label={`Job: ${job.prompt}`}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveJob(job)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{job.prompt}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-3">
                        {job.status === 'pending' && (
                          <span className="px-2 py-1 rounded-full bg-yellow-700 bg-opacity-30 text-yellow-300 text-xs flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {job.status === 'processing' && (
                          <span className="px-2 py-1 rounded-full bg-blue-700 bg-opacity-30 text-blue-300 text-xs flex items-center">
                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                            {job.progress ? `${job.progress}%` : 'Processing'}
                          </span>
                        )}
                        {job.status === 'completed' && (
                          <span className="px-2 py-1 rounded-full bg-green-700 bg-opacity-30 text-green-300 text-xs flex items-center">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {job.status === 'failed' && (
                          <span className="px-2 py-1 rounded-full bg-red-700 bg-opacity-30 text-red-300 text-xs flex items-center">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar for processing jobs */}
                    {job.status === 'processing' && job.progress && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-400">{job.progress}% complete</span>
                          {job.estimatedTimeRemaining && (
                            <span className="text-xs text-gray-400">
                              Est. {job.estimatedTimeRemaining} remaining
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        
        {/* Right column - Preview & enhancements */}
        <section className="lg:col-span-7 space-y-6">
          {/* Video preview */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Film className="mr-2 h-5 w-5 text-purple-400" />
              Video Preview
            </h2>
            
            {activeJob ? (
              <>
                <div className="aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  {activeJob.status === 'completed' && activeJob.thumbnailUrl ? (
                    // In production, this would be a video player component
                    <img 
                      src={activeJob.thumbnailUrl} 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : activeJob.status === 'processing' ? (
                    <div className="text-center p-10">
                      <RefreshCw className="animate-spin h-10 w-10 text-purple-400 mb-2 mx-auto" />
                      <p className="text-gray-300">Processing your video...</p>
                      {activeJob.progress && (
                        <p className="text-xs text-gray-400 mt-2">
                          {activeJob.progress}% complete
                          {activeJob.estimatedTimeRemaining && 
                            ` - ${activeJob.estimatedTimeRemaining} remaining`}
                        </p>
                      )}
                    </div>
                  ) : activeJob.status === 'failed' ? (
                    <div className="text-center p-10">
                      <AlertCircle className="h-10 w-10 text-red-400 mb-2 mx-auto" />
                      <p className="text-gray-300">Video generation failed</p>
                      <p className="text-xs text-red-400 mt-2">{activeJob.error}</p>
                    </div>
                  ) : (
                    <div className="text-center p-10">
                      <Clock className="h-10 w-10 text-yellow-400 mb-2 mx-auto" />
                      <p className="text-gray-300">Waiting to start processing</p>
                      <p className="text-xs text-gray-400 mt-2">Your job is in the queue</p>
                    </div>
                  )}
                </div>
                
                {/* Video title */}
                {activeJob.status === 'completed' && activeJob.selectedTitle && (
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-center">{activeJob.selectedTitle}</h3>
                  </div>
                )}
                
                {/* Job details */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Resolution</p>
                    <p className="text-sm">{activeJob.settings.resolution.join(' x ')}</p>
                  </div>
                  <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm">{activeJob.settings.duration} seconds</p>
                  </div>
                  <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Frame Rate</p>
                    <p className="text-sm">{activeJob.settings.fps} FPS</p>
                  </div>
                  <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Style</p>
                    <p className="text-sm">{activeJob.settings.style}</p>
                  </div>
                </div>
                
                {/* Action buttons */}
                {activeJob.status === 'completed' && (
                  <div className="mt-4 flex space-x-3">
                    <button 
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium flex items-center justify-center text-sm hover:from-purple-700 hover:to-blue-700 transition"
                      aria-label="Download video"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </button>
                    <button 
                      className="py-2 px-4 border border-gray-500 rounded-lg font-medium flex items-center justify-center text-sm hover:bg-gray-700 transition"
                      aria-label="Share video"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <p className="text-gray-400">No video selected</p>
              </div>
            )}
          </div>
          
          {/* AI performance insights (for Pro users) */}
          {SAMPLE_USER.tier === 'pro' && (
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                AI Performance Insights
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-3">
                  <p className="text-sm text-gray-300">Based on your recent videos, we recommend:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 mt-2 space-y-1">
                    <li>Using "tracking" camera motion for better subject focus</li>
                    <li>Increasing contrast by 15% for more vibrant output</li>
                    <li>Adding cinematic color grading for professional look</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-3">
                  <p className="text-sm text-gray-300">For optimal performance:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 mt-2 space-y-1">
                    <li>Your optimal resolution: 1920x1080 (Full HD)</li>
                    <li>Recommended prompt style: Detailed scene descriptions with lighting cues</li>
                    <li>Best AI style match: Cinematic</li>
                  </ul>
                </div>
                
                <button className="w-full py-2 px-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg text-sm font-medium flex items-center justify-center hover:from-yellow-600 hover:to-amber-600 transition">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Apply AI Recommendations
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      
      {/* Usage stats footer */}
      <footer className="bg-black bg-opacity-40 border-t border-purple-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <span>Aurora Video Synth</span>
              <span className="mx-2">•</span>
              <span>{SAMPLE_USER.tier === 'pro' ? 'Pro Account' : 'Free Account'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-400">Processing Time:</span>
                <span className="ml-2 text-purple-400 font-medium">~2-5 min per video</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">API Usage:</span>
                <span className="ml-2 text-purple-400 font-medium">32/500 requests</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Storage:</span>
                <span className="ml-2 text-purple-400 font-medium">128 MB / 5 GB</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuroraVideoSynthDashboard;
export default AuroraVideoSynthDashboard;