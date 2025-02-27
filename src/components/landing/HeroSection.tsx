
import React, { memo } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";

const HeroSection = memo(() => {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Layers - Simplified to improve performance */}
      <div className="absolute inset-0 bg-aurora-black">
        {/* Aurora Effect - Reduced complexity */}
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-purple/20 via-aurora-blue/20 to-aurora-green/20" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
        <div className="space-y-6">
          <h1 
            id="hero-title"
            className="text-4xl md:text-6xl lg:text-7xl font-bold 
                     bg-clip-text text-transparent bg-gradient-to-r 
                     from-aurora-purple via-aurora-blue to-aurora-green
                     [text-shadow:_0_0_30px_rgba(138,43,226,0.3)]"
          >
            From Imagination to Video, Instantly.
          </h1>
          
          <p 
            className="text-lg md:text-xl text-aurora-white/90 max-w-2xl mx-auto
                     [text-shadow:_0_0_20px_rgba(0,166,255,0.3)]"
            aria-describedby="hero-title"
          >
            AI-powered video creation at scale – generate, enhance, and automate with cutting-edge technology.
          </p>
        </div>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button 
            size="lg"
            className="relative group bg-gradient-to-r from-aurora-purple to-aurora-blue
                     hover:from-aurora-blue hover:to-aurora-purple
                     shadow-[0_0_30px_rgba(138,43,226,0.5)]
                     hover:shadow-[0_0_50px_rgba(0,166,255,0.7)]
                     border border-white/10 backdrop-blur-sm
                     transition-all duration-500"
            id="start-creating-button"
            name="start-creating-button"
            aria-label="Start creating videos"
          >
            Start Creating
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="group bg-aurora-black/50 border-aurora-blue/50
                     hover:bg-aurora-blue/10 hover:border-aurora-blue
                     backdrop-blur-sm transition-all duration-300"
            id="watch-demo-button"
            name="watch-demo-button"
            aria-label="Watch demonstration video"
          >
            <Play className="mr-2 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </div>
        
        {/* Social Proof - Simplified animation */}
        <div className="pt-12 space-y-4">
          <div className="flex items-center justify-center gap-2">
            {Array(5).fill(null).map((_, i) => (
              <svg 
                key={i}
                className="w-5 h-5 text-aurora-blue fill-aurora-blue"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-aurora-white/90">
            Join 10,000+ creators using Aurora Video Synth today!
          </p>
        </div>
      </div>
    </section>
  );
});

// Add display name for better debugging
HeroSection.displayName = 'HeroSection';

export default HeroSection;
