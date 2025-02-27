
import React from 'react';
import { VideoEnhancementSelector } from '@/components/video/VideoEnhancementSelector';
import { motion } from 'framer-motion';

const EnhancePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient bg-gradient-glow">
          Enhance Your Videos
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Apply AI-powered enhancements to transform your videos with advanced filters, 
          speed adjustments, and more.
        </p>
      </div>

      <div className="mt-8">
        <VideoEnhancementSelector />
      </div>
    </motion.div>
  );
};

export default EnhancePage;
