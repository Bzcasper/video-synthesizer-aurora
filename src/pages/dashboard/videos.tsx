
import React from 'react';
import { Card } from "@/components/ui/card";

const Videos = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-white">My Videos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/5 border-white/10">
          <p className="text-gray-400">No videos generated yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Your generated videos will appear here.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Videos;
