import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        onClick={handleContentClick}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden my-0 mx-0 px-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="my-[85px]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
export default DashboardLayout;
