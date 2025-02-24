
import React from 'react';
import { Zap, Wand2, Languages, Workflow, Share2 } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    title: "AI-Powered Text-to-Video",
    description: "Transform your words into stunning videos with advanced AI generation"
  },
  {
    icon: <Wand2 className="w-6 h-6 text-cyan-400" />,
    title: "Ultra-Realistic Enhancements",
    description: "Stable Diffusion XL for crystal-clear, high-quality frames"
  },
  {
    icon: <Languages className="w-6 h-6 text-emerald-400" />,
    title: "Multilingual Dubbing",
    description: "Perfect lip-sync in multiple languages with AI voice generation"
  },
  {
    icon: <Workflow className="w-6 h-6 text-blue-400" />,
    title: "Workflow Automation",
    description: "Seamless integration with n8n & Supabase for automated workflows"
  },
  {
    icon: <Share2 className="w-6 h-6 text-pink-400" />,
    title: "Social Media Ready",
    description: "Instant formatting for TikTok, YouTube Shorts, and Instagram"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Powered by Cutting-Edge AI
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-panel p-6 hover-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-white/5 backdrop-blur-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
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
