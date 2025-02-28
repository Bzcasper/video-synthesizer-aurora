
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
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

  // Close sidebar on mobile when changing routes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle content click to close sidebar on mobile
  const handleContentClick = () => {
    if (window.innerWidth < 768 && isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-aurora-black overflow-hidden">
      <DashboardSidebar 
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isTransitioning={isTransitioning}
        setIsTransitioning={setIsTransitioning}
      />

      {/* Main content - full width */}
      <main 
        className="flex-1 w-full overflow-y-auto overflow-x-hidden" 
        onClick={handleContentClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-[2000px] mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 ${isTransitioning ? 'pointer-events-none' : ''}`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardLayout;
