
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuButtonProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
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
  );
};

export default MobileMenuButton;
