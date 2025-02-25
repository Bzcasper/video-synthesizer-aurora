'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate();
  
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
    
    // In production, this would be an actual API call to the Edge Function
    try {
      // API route: POST /api/video/generate
      // const response = await fetch('/api/video/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt, settings, images: uploadedImages, audio: uploadedAudio }),
      // });
      // const data = await response.json();
      
      // For demo, simulate successful job creation
      console.log('Generating video with prompt:', prompt);
      console.log('Settings:', settings);
      
      setTimeout(() => {
        // Simulate successful job creation
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
    
    // In production, this would call the enhancement API
    // API route: POST /api/video/enhance
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

export default AuroraVideoSynthDashboard;
