
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import MainContent from '@/components/dashboard/layout/MainContent';
import MobileMenuButton from '@/components/dashboard/layout/MobileMenuButton';
import { AnimatePresence, motion } from 'framer-motion';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Set sidebar to open by default on larger screens, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleContentClick = () => {
    if (window.innerWidth < 768 && isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-aurora-black flex w-full">
      {/* Mobile menu button */}
      <MobileMenuButton 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 768 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main content */}
      <MainContent 
        isTransitioning={isTransitioning} 
        handleContentClick={handleContentClick}
        className="w-full"
      >
        {children}
      </MainContent>
    </div>
  );
};

export default DashboardLayout;
