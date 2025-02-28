
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { NavItems } from './NavItems';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleLogout = async () => {
    setIsTransitioning(true);
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      setTimeout(() => navigate('/login'), 300);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
      setIsTransitioning(false);
    }
  };

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: isSidebarOpen ? 0 : -280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed md:static w-64 h-full border-r border-white/10 bg-black/20 backdrop-blur-xl z-40 md:translate-x-0`}
    >
      <div className="p-6">
        {/* Aurora logo */}
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="relative">
            <img
              src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
              alt="Aurora"
              className="h-8 w-8 transition-all duration-golden group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10 
                          group-hover:opacity-75 transition-opacity duration-golden" />
          </div>
          <span className="text-xl font-orbitron font-bold bg-clip-text text-transparent 
                         bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green">
            Aurora
          </span>
        </Link>
      </div>

      <nav className="mt-6 px-2">
        <NavItems />
      </nav>

      <div className="absolute bottom-8 w-full px-6">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-200
                   hover:text-white hover:bg-white/5"
          disabled={isTransitioning}
        >
          <div className="mr-3 flex items-center justify-center w-8 h-8 rounded-md bg-black/20">
            <LogOut className="h-5 w-5 text-gray-300" />
          </div>
          <span>Logout</span>
        </Button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
