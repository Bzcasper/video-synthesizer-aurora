
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CustomIcon from '@/components/ui/custom-icon';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    setIsTransitioning(true);
    await supabase.auth.signOut();
    setTimeout(() => navigate('/login'), 300);
  };

  const navItems = [
    { icon: 'home', label: 'Dashboard', path: '/dashboard' },
    { icon: 'generate', label: 'Generate Video', path: '/dashboard/generate' },
    { icon: 'enhance', label: 'Enhance Video', path: '/dashboard/enhance' },
    { icon: 'batch', label: 'Batch Queue', path: '/dashboard/batch' },
    { icon: 'videos', label: 'My Videos', path: '/dashboard/videos' },
    { icon: 'stats', label: 'Processing Stats', path: '/dashboard/stats' },
    { icon: 'settings', label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  // Close sidebar when clicking outside on mobile
  const handleContentClick = () => {
    if (window.innerWidth < 768 && isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurora-black flex">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <CustomIcon name="menu" className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <aside className={`fixed md:static w-64 h-full border-r border-white/10 bg-black/20 backdrop-blur-xl transform transition-transform duration-golden z-40 
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6"
        >
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
        </motion.div>

        <nav className="mt-fib-3 space-y-1">
          <AnimatePresence>
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-golden relative
                             ${isActivePath(item.path)
                    ? 'text-aurora-blue bg-aurora-blue/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`mr-3 flex items-center justify-center w-8 h-8 rounded-md ${isActivePath(item.path) ? 'bg-aurora-blue/20' : 'bg-black/20'}`}>
                    <CustomIcon name={item.icon} className={`h-5 w-5 ${isActivePath(item.path) ? 'text-aurora-blue' : 'text-gray-400'}`} />
                  </div>
                  {item.label}
                  {isActivePath(item.path) && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute right-0 top-0 h-full w-0.5 bg-aurora-blue"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>

        <div className="absolute bottom-8 w-full px-6">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-400
                     hover:text-white hover:bg-white/5 transition-golden rounded-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mr-3 flex items-center justify-center w-8 h-8 rounded-md bg-black/20">
              <CustomIcon name="logout" className="h-5 w-5 text-gray-400" />
            </div>
            Logout
          </motion.button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden" onClick={handleContentClick}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`container mx-auto px-6 py-8 ${isTransitioning ? 'pointer-events-none' : ''}`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardLayout;
