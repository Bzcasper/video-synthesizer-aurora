
import React from 'react';
import { motion } from 'framer-motion';
import { BatchQueuePanel } from '@/components/video/batch/BatchQueuePanel';
import { BatchStats } from '@/components/video/batch/BatchStats';
import { BatchHistory } from '@/components/video/batch/BatchHistory';

const BatchQueuePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container px-4 py-fib-5 space-y-fib-5 max-w-[1920px] mx-auto w-full"
    >
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient bg-gradient-glow">
          Batch Processing Queue
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Manage and monitor your video processing jobs in a unified queue system.
        </p>
      </div>

      <BatchQueuePanel />
      <BatchStats />
      <BatchHistory />
    </motion.div>
  );
};

export default BatchQueuePage;
