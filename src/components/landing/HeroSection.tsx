
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-emerald-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-blue-500/10 to-emerald-500/10 animate-pulse" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 animate-fade-in">
          From Imagination to Video, Instantly.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in animation-delay-200">
          AI-powered video creation at scale – generate, enhance, and automate with cutting-edge technology.
        </p>
        
        <Button 
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 
                     shadow-lg hover:shadow-cyan-500/50 transition-all duration-300
                     border border-white/10 backdrop-blur-sm animate-fade-in animation-delay-300"
        >
          Start Creating
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
