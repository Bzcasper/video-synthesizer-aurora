
import React from 'react';
import { 
  Type, 
  Wand2, 
  Languages, 
  Workflow, 
  AspectRatio, 
  Code 
} from 'lucide-react';

const features = [
  {
    icon: <Type className="w-6 h-6 text-aurora-blue" />,
    title: "AI-Powered Text-to-Video",
    description: "Type a prompt, get a stunning video."
  },
  {
    icon: <Wand2 className="w-6 h-6 text-aurora-purple" />,
    title: "Ultra-Realistic Frame Enhancements",
    description: "Powered by Stable Diffusion XL."
  },
  {
    icon: <Languages className="w-6 h-6 text-aurora-green" />,
    title: "Multilingual Dubbing & Lip Syncing",
    description: "AI-driven voiceovers & translations."
  },
  {
    icon: <Workflow className="w-6 h-6 text-aurora-blue" />,
    title: "Workflow Automation",
    description: "Seamless content automation with n8n & Supabase."
  },
  {
    icon: <AspectRatio className="w-6 h-6 text-aurora-purple" />,
    title: "Instant Social Media Formatting",
    description: "Auto-resizes for TikTok, YouTube, Instagram."
  },
  {
    icon: <Code className="w-6 h-6 text-aurora-green" />,
    title: "API Access for Developers",
    description: "Scale video production effortlessly."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green">
          What We Offer
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-panel p-8 hover-glow transition-all duration-500 animate-fade-in group"
              style={{ 
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${20}px)` 
              }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                               group-hover:border-aurora-blue/50 transition-all duration-500
                               group-hover:shadow-lg group-hover:shadow-aurora-blue/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white/90 group-hover:text-white
                              transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-white/60 group-hover:text-white/80
                            transition-colors duration-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
