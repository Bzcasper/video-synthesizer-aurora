
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-white">
          Welcome to Aurora
        </h1>
        <Button
          onClick={() => navigate('/dashboard/generate')}
          className="bg-gradient-to-r from-aurora-purple to-aurora-blue
                   hover:from-aurora-blue hover:to-aurora-purple
                   shadow-lg hover:shadow-aurora-blue/50
                   transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Generate Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for recent videos */}
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-2">Recent Videos</h3>
          <p className="text-gray-400">
            Your recently generated videos will appear here
          </p>
        </div>

        {/* Placeholder for usage stats */}
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-2">Usage Stats</h3>
          <p className="text-gray-400">
            Track your video generation usage here
          </p>
        </div>

        {/* Placeholder for quick actions */}
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-2">Quick Actions</h3>
          <p className="text-gray-400">
            Common actions and shortcuts will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
