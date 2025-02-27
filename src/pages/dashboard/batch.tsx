
import React from 'react';
import { motion } from 'framer-motion';
import CustomIcon from '@/components/ui/custom-icon';
import { Button } from '@/components/ui/button';
import { BatchQueueList } from '@/components/video/BatchQueueList';

const BatchQueuePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-fib-5"
    >
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient bg-gradient-glow">
          Batch Processing Queue
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Manage and monitor your video processing jobs in a unified queue system.
        </p>
      </div>

      <div className="glass-panel p-fib-4 rounded-lg">
        <div className="flex items-center justify-between mb-fib-4">
          <div className="flex items-center gap-3">
            <CustomIcon name="batch" className="h-fib-3 w-fib-3 text-aurora-purple" />
            <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow">
              Active Queue
            </h2>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-aurora-purple/30 hover:border-aurora-purple/60 text-aurora-purple"
            >
              Pause All
            </Button>
            <Button 
              variant="outline" 
              className="border-aurora-blue/30 hover:border-aurora-blue/60 text-aurora-blue"
            >
              Prioritize
            </Button>
          </div>
        </div>
        
        <BatchQueueList />
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-fib-4">
        <div className="glass-panel p-fib-4 rounded-lg">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">API Usage</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-aurora-white">32/500</span>
              <div className="text-xs text-aurora-green">
                <span className="font-medium">468</span> credits remaining
              </div>
            </div>
            <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-aurora-purple to-aurora-blue h-full rounded-full" style={{ width: '6.4%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-fib-4 rounded-lg">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Storage</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-aurora-white">128MB/5GB</span>
              <div className="text-xs text-aurora-blue">
                <span className="font-medium">4.87GB</span> free
              </div>
            </div>
            <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-aurora-blue to-aurora-green h-full rounded-full" style={{ width: '2.56%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-fib-4 rounded-lg">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Processing Speed</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-aurora-white">Standard</span>
              <div className="text-xs text-aurora-purple">
                <span className="font-medium">Pro Plan</span> for 2x speed
              </div>
            </div>
            <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-aurora-green to-aurora-purple h-full rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job History */}
      <div className="glass-panel p-fib-4 rounded-lg">
        <div className="flex items-center gap-3 mb-fib-4">
          <CustomIcon name="stats" className="h-fib-3 w-fib-3 text-aurora-blue" />
          <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow">
            Job History
          </h2>
        </div>
        
        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-aurora-white font-medium">Cinematic mountain landscape</h3>
                <div className="text-xs text-aurora-green mt-1">Completed • 02/24/2025 10:30 AM</div>
              </div>
              <Button className="bg-gradient-to-r from-aurora-blue to-aurora-green text-white">
                View
              </Button>
            </div>
          </div>
          
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-aurora-white font-medium">Futuristic cityscape with neon</h3>
                <div className="text-xs text-red-400 mt-1">Failed • 02/24/2025 5:45 PM</div>
              </div>
              <Button className="bg-gradient-to-r from-red-500 to-aurora-purple text-white">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BatchQueuePage;
