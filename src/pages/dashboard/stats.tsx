
import React from 'react';
import { motion } from 'framer-motion';
import CustomIcon from '@/components/ui/custom-icon';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

// Mock data for the charts
const weeklyProcessingData = [
  { name: 'Mon', videos: 5 },
  { name: 'Tue', videos: 8 },
  { name: 'Wed', videos: 12 },
  { name: 'Thu', videos: 7 },
  { name: 'Fri', videos: 10 },
  { name: 'Sat', videos: 15 },
  { name: 'Sun', videos: 9 },
];

const monthlyUsageData = [
  { name: 'Week 1', usage: 35 },
  { name: 'Week 2', usage: 42 },
  { name: 'Week 3', usage: 28 },
  { name: 'Week 4', usage: 50 },
];

const processingTimeData = [
  { name: '1080p', time: 3.2 },
  { name: '4K', time: 7.5 },
  { name: '8K', time: 12.1 },
];

const StatsPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-fib-5"
    >
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient bg-gradient-glow">
          Processing Stats
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Visualize your video processing activity and performance metrics.
        </p>
      </div>

      {/* Resource Usage Summary */}
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
      
      {/* Weekly Video Processing */}
      <div className="glass-panel p-fib-4 rounded-lg">
        <div className="flex items-center gap-3 mb-fib-4">
          <CustomIcon name="stats" className="h-fib-3 w-fib-3 text-aurora-blue" />
          <h2 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-glow">
            Weekly Video Processing
          </h2>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyProcessingData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                  border: '1px solid rgba(138, 43, 226, 0.5)',
                  borderRadius: '8px'
                }} 
              />
              <Bar 
                dataKey="videos" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]} 
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8A2BE2" stopOpacity={1} />
                  <stop offset="50%" stopColor="#00A6FF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#00FFAA" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Monthly Usage & Processing Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-4">
        <div className="glass-panel p-fib-4 rounded-lg">
          <div className="flex items-center gap-3 mb-fib-4">
            <CustomIcon name="batch" className="h-fib-3 w-fib-3 text-aurora-purple" />
            <h2 className="text-xl font-orbitron font-bold text-gradient bg-gradient-glow">
              Monthly API Usage
            </h2>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyUsageData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                    border: '1px solid rgba(138, 43, 226, 0.5)',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#8A2BE2" 
                  strokeWidth={2} 
                  dot={{ stroke: '#00A6FF', strokeWidth: 2, r: 4, fill: '#0A0A0A' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel p-fib-4 rounded-lg">
          <div className="flex items-center gap-3 mb-fib-4">
            <CustomIcon name="processing" className="h-fib-3 w-fib-3 text-aurora-green" />
            <h2 className="text-xl font-orbitron font-bold text-gradient bg-gradient-glow">
              Avg. Processing Times
            </h2>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={processingTimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                    border: '1px solid rgba(0, 255, 170, 0.5)',
                    borderRadius: '8px'
                  }} 
                  formatter={(value) => [`${value} minutes`, 'Processing Time']}
                />
                <Bar 
                  dataKey="time" 
                  fill="url(#timeGradient)" 
                  radius={[0, 8, 8, 0]} 
                />
                <defs>
                  <linearGradient id="timeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00FFAA" stopOpacity={1} />
                    <stop offset="100%" stopColor="#00A6FF" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsPage;
