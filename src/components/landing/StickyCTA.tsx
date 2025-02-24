
import React from 'react';
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';

const StickyCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-white/10 py-4 z-50 animate-slide-up">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center text-gray-300">
          <Users className="w-5 h-5 text-cyan-400 mr-2" />
          Join 10,000+ creators using Aurora Video Synth today!
        </div>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500
                     shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 whitespace-nowrap"
        >
          Get Started Now
        </Button>
      </div>
    </div>
  );
};

export default StickyCTA;
