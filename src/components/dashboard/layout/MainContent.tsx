
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface MainContentProps {
  children: React.ReactNode;
  isTransitioning: boolean;
  handleContentClick: () => void;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({ 
  children, 
  isTransitioning, 
  handleContentClick,
  className = '' 
}) => {
  const location = useLocation();

  return (
    <main 
      className={`flex-1 w-full overflow-x-hidden ${className}`.trim()} 
      onClick={handleContentClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className={`w-full h-full max-w-full p-4 md:p-8 ${isTransitioning ? 'pointer-events-none' : ''}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default MainContent;
