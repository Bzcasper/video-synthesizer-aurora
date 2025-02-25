
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div 
      className="min-h-screen bg-aurora-black"
      style={{ 
        height: 'auto',
        overflow: 'visible',
        position: 'static'
      }}
    >
      {children}
    </div>
  );
};

export default PageLayout;
