
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Video, 
  Wand2, 
  SquareStack, 
  Film, 
  BarChart2, 
  Settings, 
  LogOut, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  isSidebarOpen, 
  setSidebarOpen, 
  isTransitioning,
  setIsTransitioning
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Video className="h-5 w-5" />, label: 'Generate Video', path: '/dashboard/generate' },
    { icon: <Wand2 className="h-5 w-5" />, label: 'Enhance Video', path: '/dashboard/enhance' },
    { icon: <SquareStack className="h-5 w-5" />, label: 'Batch Queue', path: '/dashboard/batch' },
    { icon: <Film className="h-5 w-5" />, label: 'My Videos', path: '/dashboard/videos' },
    { icon: <BarChart2 className="h-5 w-5" />, label: 'Stats', path: '/dashboard/stats' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

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
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden bg-black/20 backdrop-blur-md hover:bg-black/30"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <motion.div className="h-5 w-5" />
        )}
      </Button>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed md:relative w-64 h-screen z-40 md:translate-x-0 flex flex-col bg-black/90 backdrop-blur-lg border-r border-white/10"
      >
        <div className="p-6 border-b border-white/10">
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

        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            <AnimatePresence>
              {navItems.map((item, index) => {
                const isActive = isActivePath(item.path);
                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-md text-sm font-medium relative transition-colors",
                        isActive 
                          ? "text-aurora-blue bg-aurora-blue/10" 
                          : "text-gray-200 hover:bg-white/5 hover:text-white"
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className={cn(
                        "mr-3 flex items-center justify-center w-8 h-8 rounded-md",
                        isActive ? "bg-aurora-blue/20" : "bg-black/20"
                      )}>
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="active-nav"
                          className="absolute right-0 top-0 h-full w-1 bg-aurora-blue"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
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
    </>
  );
};

export default DashboardSidebar;
