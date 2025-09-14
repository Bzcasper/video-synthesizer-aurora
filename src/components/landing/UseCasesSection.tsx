import React from "react";
import { Video, TrendingUp, Users, Globe } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const useCases = [
  {
    icon: <Video className="w-6 h-6 text-cyan-400" />,
    title: "Content Creators",
    description: "Automate & scale video production with AI-powered tools",
    gradient: "from-purple-500/20 to-purple-800/20",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
    title: "Businesses",
    description: "Create engaging ads, marketing videos, and branded content",
    gradient: "from-blue-500/20 to-blue-800/20",
  },
  {
    icon: <Users className="w-6 h-6 text-emerald-400" />,
    title: "Virtual Influencers",
    description: "Generate and animate AI-driven avatars for your brand",
    gradient: "from-emerald-500/20 to-emerald-800/20",
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    title: "Localization Teams",
    description: "Streamline content translation and dubbing with AI",
    gradient: "from-cyan-500/20 to-cyan-800/20",
  },
];

const UseCasesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background/80 to-background">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 
                     bg-clip-text text-transparent bg-gradient-to-r 
                     from-emerald-400 to-blue-400"
        >
          Transform Any Industry
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="gap-4">
            {useCases.map((useCase, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div
                  className="glass-panel p-6 rounded-xl border border-white/10
                           bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl
                           hover:border-white/20 transition-all duration-500 
                           hover:shadow-[0_0_30px_10px_rgba(0,0,0,0.2)]
                           animate-fade-in group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-full bg-gradient-to-br ${useCase.gradient}
                                   backdrop-blur-xl border border-white/10 shrink-0
                                   group-hover:border-white/20 transition-colors
                                   group-hover:shadow-lg`}
                    >
                      {useCase.icon}
                    </div>
                    <div>
                      <h3
                        className="text-xl font-semibold text-gray-100 mb-2
                                   group-hover:text-white transition-colors"
                      >
                        {useCase.title}
                      </h3>

                      <p
                        className="text-gray-400 group-hover:text-gray-300
                                  transition-colors"
                      >
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default UseCasesSection;
