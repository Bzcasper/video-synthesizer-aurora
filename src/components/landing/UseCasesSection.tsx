
import React from 'react';
import { Video, TrendingUp, Users, Globe } from 'lucide-react';

const useCases = [
  {
    icon: <Video className="w-6 h-6 text-purple-400" />,
    title: "Content Creators",
    description: "Automate & scale video production with AI-powered tools"
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
    title: "Businesses",
    description: "Create engaging ads, marketing videos, and branded content"
  },
  {
    icon: <Users className="w-6 h-6 text-emerald-400" />,
    title: "Virtual Influencers",
    description: "Generate and animate AI-driven avatars for your brand"
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    title: "Localization Teams",
    description: "Streamline content translation and dubbing with AI"
  }
];

const UseCasesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background/80 to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
          Transform Any Industry
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="glass-panel p-6 hover-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-white/5 backdrop-blur-xl shrink-0">
                  {useCase.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-400">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
