
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  isLoading?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isLoading = false }) => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className={`relative transition-golden ${
        isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <img
          src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
          alt="Aurora Video Synth"
          className={`h-10 w-10 object-contain logo-hover
                    ${isLoading ? 'logo-preloader' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
      </div>
      <span className="ml-2 text-2xl font-orbitron font-bold bg-clip-text text-transparent 
                     bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green">
        Aurora
      </span>
    </Link>
  );
};

export default Logo;
