
import React from 'react';
import { 
  Type, 
  Wand2, 
  Languages, 
  Workflow, 
  LayoutGrid, 
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
    icon: <LayoutGrid className="w-6 h-6 text-aurora-purple" />,
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
    <section className="relative py-24">
      {/* Background with gradient and glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-aurora-purple/10 via-aurora-blue/10 to-aurora-green/10 opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 
                     bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green 
                     bg-clip-text text-transparent 
                     [text-shadow:_0_0_30px_rgba(138,43,226,0.3)]">
          What We Offer
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg p-8
                       bg-gradient-to-br from-white/10 to-white/5
                       hover:from-white/15 hover:to-white/10
                       backdrop-blur-lg border border-white/10
                       hover:border-aurora-blue/50 
                       group transition-all duration-500 
                       hover:shadow-[0_0_30px_rgba(0,166,255,0.2)]
                       animate-fade-in"
              style={{ 
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-xl
                             border border-white/10 group-hover:border-aurora-blue/50 
                             transition-all duration-500
                             group-hover:shadow-lg group-hover:shadow-aurora-blue/20">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-white
                             group-hover:text-aurora-blue transition-colors duration-500">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 group-hover:text-white
                           transition-colors duration-500">
                  {feature.description}
                </p>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br 
                           from-aurora-purple/5 via-aurora-blue/5 to-aurora-green/5 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
