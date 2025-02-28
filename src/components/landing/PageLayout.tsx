
import React, { Suspense } from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-aurora-black">
      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center bg-aurora-black">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-aurora-blue"></div>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  );
};

export default PageLayout;
