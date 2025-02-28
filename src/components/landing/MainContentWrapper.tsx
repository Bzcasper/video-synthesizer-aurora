
import React from 'react';
import { motion } from 'framer-motion';

interface MainContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const MainContentWrapper = ({ children, className = '' }: MainContentWrapperProps) => {
  // Animation variants for child elements
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  return (
    <motion.div 
      className={`w-full max-w-full relative z-10 bg-aurora-black overflow-x-hidden ${className}`.trim()}
      variants={childVariants}
    >
      {children}
    </motion.div>
  );
};

export default MainContentWrapper;
