
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";

const DemoSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="aspect-video relative rounded-lg overflow-hidden backdrop-blur-xl">
            {/* Placeholder for demo video */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-emerald-900/20 flex items-center justify-center">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20"
              >
                <Play className="mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button
              size="lg"
              variant="default"
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500
                       shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
              Try a Live Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
