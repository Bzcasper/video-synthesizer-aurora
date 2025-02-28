
import React from 'react';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainContentWrapper;
