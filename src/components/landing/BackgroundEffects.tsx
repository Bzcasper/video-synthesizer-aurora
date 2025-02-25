
import React from 'react';

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-aurora-purple/5 via-aurora-blue/5 to-aurora-green/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-aurora-purple/10 via-aurora-blue/10 to-aurora-green/10 opacity-30" />
    </div>
  );
};

export default BackgroundEffects;
