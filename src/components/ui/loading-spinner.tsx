
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="animate-spin-slow">
        <img
          src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
          alt="Loading..."
          className="w-16 h-16 filter brightness-150"
        />
      </div>
    </div>
  );
};
