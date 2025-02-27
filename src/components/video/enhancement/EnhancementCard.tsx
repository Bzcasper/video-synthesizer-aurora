
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Enhancement } from '@/hooks/use-video-enhancements';

interface EnhancementCardProps {
  enhancement: Enhancement;
  isSelected: boolean;
  onSelect: () => void;
}

export const EnhancementCard: React.FC<EnhancementCardProps> = ({ 
  enhancement, 
  isSelected, 
  onSelect 
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`cursor-pointer p-6 transition-all duration-golden ${
              enhancement.comingSoon ? 'opacity-50 cursor-not-allowed' :
              isSelected 
                ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
                : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
            }`}
            onClick={() => !enhancement.comingSoon && onSelect()}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div 
                className="text-aurora-blue"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: enhancement.comingSoon ? 0 : [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              >
                {enhancement.icon}
              </motion.div>
              <div>
                <motion.div 
                  className="font-medium mb-2"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {enhancement.label}
                </motion.div>
                <motion.div 
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {enhancement.description}
                </motion.div>
              </div>
              {enhancement.comingSoon && (
                <motion.span 
                  className="text-xs px-2 py-1 rounded-full bg-aurora-purple/20 text-aurora-purple"
                  animate={{ 
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Coming Soon
                </motion.span>
              )}
            </div>
          </Card>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px] text-center">
        {enhancement.description}
      </TooltipContent>
    </Tooltip>
  );
};
