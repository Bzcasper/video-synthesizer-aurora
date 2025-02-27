
import React from 'react';
import { VideoEnhancementSelector } from '@/components/video/VideoEnhancementSelector';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CustomIcon from '@/components/ui/custom-icon';
import { EnhancementProcessingStatus } from '@/components/video/EnhancementProcessingStatus';

const EnhancePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-fib-5"
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

      <div className="glass-panel p-fib-4 rounded-lg">
        <div className="flex items-center gap-3 mb-fib-4">
          <CustomIcon name="enhance" className="h-fib-3 w-fib-3 text-aurora-blue" />
          <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow">
            Video Enhancement Tools
          </h2>
        </div>
        
        <VideoEnhancementSelector />
      </div>
      
      {/* Processing Status Section */}
      <div className="glass-panel p-fib-4 rounded-lg">
        <div className="flex items-center gap-3 mb-fib-4">
          <CustomIcon name="processing" className="h-fib-3 w-fib-3 text-aurora-purple" />
          <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow">
            Processing Status
          </h2>
        </div>
        
        <EnhancementProcessingStatus />
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-fib-3 mt-fib-5">
        <Button
          className="btn-fibonacci bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple shadow-neon transition-golden"
          onClick={() => window.location.href = '/dashboard/generate'}
        >
          <CustomIcon name="generate" className="mr-2 h-5 w-5" />
          Generate New Video
        </Button>
        
        <Button
          className="btn-fibonacci bg-gradient-to-r from-aurora-green to-aurora-blue hover:from-aurora-blue hover:to-aurora-green shadow-neon transition-golden"
          onClick={() => window.location.href = '/dashboard/videos'}
        >
          <CustomIcon name="videos" className="mr-2 h-5 w-5" />
          View My Videos
        </Button>
      </div>
    </motion.div>
  );
};

export default EnhancePage;
