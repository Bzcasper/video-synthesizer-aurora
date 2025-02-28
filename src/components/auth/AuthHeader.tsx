
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface AuthHeaderProps {
  title: string;
  description: string;
  logoSrc?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  title, 
  description, 
  logoSrc = "/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png" 
}) => {
  return (
    <>
      <div className="flex justify-center mb-2">
        <div className="relative">
          <img
            src={logoSrc}
            alt="Aurora"
            className="h-12 w-12"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
        </div>
      </div>
      <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green">
        {title}
      </CardTitle>
      <CardDescription className="text-center text-gray-400">
        {description}
      </CardDescription>
    </>
  );
};
