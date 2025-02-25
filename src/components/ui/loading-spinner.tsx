
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  mode?: 'loading' | 'processing' | 'transition';
}

export const LoadingSpinner = ({ className, mode = 'loading' }: LoadingSpinnerProps) => {
  const animationClass = mode === 'processing' 
    ? 'logo-processing' 
    : mode === 'transition'
    ? 'logo-transition'
    : 'logo-preloader';

  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className={`relative ${animationClass}`}>
        <img
          src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
          alt="Loading..."
          className="w-16 h-16 relative z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
      </div>
    </div>
  );
};
