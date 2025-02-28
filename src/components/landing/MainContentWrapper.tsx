
import React from 'react';
import NavigationBar from './NavigationBar';
import StickyCTA from './StickyCTA';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="flex-1">
        <div className="container mx-auto px-fib-3 py-fib-4 md:py-fib-5">
          {children}
        </div>
      </main>
      <StickyCTA />
    </div>
  );
};

export default MainContentWrapper;
