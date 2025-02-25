
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Enhancement } from '@/hooks/use-video-enhancements';

interface EnhancementOptionsGridProps {
  enhancements: Enhancement[];
  selectedEnhancement: Enhancement | null;
  onSelectEnhancement: (enhancement: Enhancement) => void;
}

export const EnhancementOptionsGrid = ({ 
  enhancements, 
  selectedEnhancement, 
  onSelectEnhancement 
}: EnhancementOptionsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {enhancements.map((enhancement) => (
        <Tooltip key={enhancement.id}>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer p-6 transition-all duration-300 ${
                  enhancement.comingSoon ? 'opacity-50 cursor-not-allowed' :
                  selectedEnhancement?.id === enhancement.id 
                    ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
                    : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
                }`}
                onClick={() => !enhancement.comingSoon && onSelectEnhancement(enhancement)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-aurora-blue">{enhancement.icon}</div>
                  <div>
                    <div className="font-medium mb-2">{enhancement.label}</div>
                    <div className="text-sm text-gray-400">{enhancement.description}</div>
                  </div>
                  {enhancement.comingSoon && (
                    <span className="text-xs px-2 py-1 rounded-full bg-aurora-purple/20 text-aurora-purple">
                      Coming Soon
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-center">
            {enhancement.description}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
