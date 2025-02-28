
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";

const DemoSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="glass-panel p-8 relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-xl
                      bg-gradient-to-br from-white/5 to-white/10
                      shadow-[0_0_40px_10px_rgba(0,0,0,0.1)]">
          <div className="aspect-video relative rounded-lg overflow-hidden backdrop-blur-xl
                        border border-white/20 shadow-[0_0_30px_10px_rgba(8,0,32,0.3)]
                        animate-fade-in">
            {/* Placeholder for demo video */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-emerald-900/20 
                          flex items-center justify-center">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20
                         transition-all duration-300 group
                         hover:scale-105 hover:shadow-[0_0_30px_10px_rgba(255,255,255,0.1)]"
              >
                <Play className="mr-2 group-hover:text-purple-400 transition-colors" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button
              size="lg"
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-blue-600 
                       hover:from-purple-500 hover:to-blue-500
                       shadow-lg hover:shadow-purple-500/50 transition-all duration-300
                       scale-100 hover:scale-105 animate-fade-in"
            >
              Generate Your First AI Video
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
