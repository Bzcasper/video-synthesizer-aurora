
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MobileMenuButtonProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden bg-black/20 backdrop-blur-md hover:bg-black/30"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
    </motion.div>
  );
};

export default MobileMenuButton;
