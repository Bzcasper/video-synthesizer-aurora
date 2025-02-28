
import React from 'react';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  return (
    <div className="w-full max-w-full relative z-10 bg-aurora-black overflow-x-hidden">
      {children}
    </div>
  );
};

export default MainContentWrapper;
