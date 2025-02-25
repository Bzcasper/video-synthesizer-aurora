
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div 
      className="min-h-screen w-full bg-aurora-black"
      style={{ 
        position: 'relative',
        overflow: 'auto'
      }}
    >
      {children}
    </div>
  );
};

export default PageLayout;
