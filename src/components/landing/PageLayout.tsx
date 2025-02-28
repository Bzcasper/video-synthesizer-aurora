
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  // Animation variants for page content
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-aurora-black relative overflow-x-hidden">
      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center bg-aurora-black">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-aurora-blue"></div>
        </div>
      }>
        <motion.div 
          className="relative z-10 bg-aurora-black w-full"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {children}
        </motion.div>
      </Suspense>
    </div>
  );
};

export default PageLayout;
