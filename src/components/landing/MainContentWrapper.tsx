import React from "react";
import NavigationBar from "./NavigationBar";
import StickyCTA from "./StickyCTA";

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavigationBar />
      <main className="flex-1 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 py-fib-4 md:py-fib-5">
          {children}
        </div>
      </main>
      <StickyCTA />
    </div>
  );
};

export default MainContentWrapper;
