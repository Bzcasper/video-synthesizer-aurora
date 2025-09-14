import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const EnhancedHeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-aurora-black overflow-hidden">
        {/* Aurora Effect 1 */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-radial from-aurora-purple/20 via-transparent to-transparent opacity-60 blur-3xl" />

        {/* Aurora Effect 2 */}
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-radial from-aurora-blue/20 via-transparent to-transparent opacity-50 blur-3xl animate-pulse-slow" />

        {/* Aurora Effect 3 */}
        <div
          className="absolute bottom-0 left-[20%] w-[400px] h-[400px] bg-gradient-radial from-green-500/20 via-transparent to-transparent opacity-40 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-[length:50px_50px] opacity-10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 py-16">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-aurora-blue via-aurora-purple to-aurora-green animate-fade-in">
              Transform Text into <br />
              <span className="relative">
                Stunning Videos
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-aurora-blue to-aurora-purple rounded-full"></span>
              </span>
            </h1>

            <p
              className="text-xl text-gray-300 mb-8 max-w-xl animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Aurora Video Synthesizer uses advanced AI to generate high-quality
              videos from your text descriptions. Create mind-blowing content in
              minutes, not hours.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple shadow-glow"
              >
                Try It Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-aurora-blue/50 bg-transparent hover:bg-aurora-blue/10"
              >
                View Samples
              </Button>
            </div>

            <div
              className="mt-8 flex items-center gap-2 text-gray-400 text-sm animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 text-green-400">
                ✓
              </span>
              <span>No sign-up required for first generation</span>

              <span className="ml-4 inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 text-green-400">
                ✓
              </span>
              <span>High-quality AI renders</span>
            </div>
          </div>

          <div
            className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,123,255,0.3)]">
              {/* Replace with an actual video preview or a mockup image */}
              <div className="aspect-video bg-gradient-to-br from-black via-gray-900 to-black rounded-lg border border-white/10 flex items-center justify-center relative">
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-aurora-purple to-aurora-blue flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Placeholder Content */}
                <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover opacity-20" />
              </div>

              {/* Video Generation Mockup UI */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-aurora-blue animate-pulse"></div>
                  <span className="text-sm text-aurora-white">
                    AI Video Generation in Progress
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-aurora-blue to-aurora-purple w-[60%] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
