import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
const Dashboard = () => {
  const navigate = useNavigate();
  return <div className="space-y-6">
      <div className="flex items-center justify-between mx-[10px]">
        <h1 className="font-orbitron text-white text-5xl my-0 mx-[53px] px-[9px] py-fib-2 font-semibold text-right">
          Welcome to Aurora
        </h1>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for recent videos */}
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-2 text-center">Recent Videos</h3>
          <p className="text-gray-400 text-center">
            Your recently generated videos will appear here
          </p>
        </div>

        {/* Placeholder for usage stats */}
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-2 text-center">Usage Stats</h3>
          <p className="text-gray-400 text-center">
            Track your video generation usage here
          </p>
        </div>

        {/* Placeholder for quick actions */}
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-2 text-center">Quick Actions</h3>
          <p className="text-gray-400 text-center">
            Common actions and shortcuts will appear here
          </p>
        </div>
      </div>
    </div>;
};
export default Dashboard;