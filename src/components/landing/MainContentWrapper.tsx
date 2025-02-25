
import React from 'react';
import NavigationBar from './NavigationBar';
import StickyCTA from './StickyCTA';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  return (
    <div className="relative z-10">
      <NavigationBar />
      <main className="relative">
        {children}
      </main>
      <StickyCTA />
    </div>
  );
};

export default MainContentWrapper;
