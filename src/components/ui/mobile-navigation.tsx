import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Video, 
  Plus, 
  Settings, 
  Menu, 
  X, 
  Search,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from './button';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Input } from './input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

interface MobileNavigationProps {
  isAuthenticated?: boolean;
  userEmail?: string | null;
}

export const MobileNavigation: FC<MobileNavigationProps> = ({ 
  isAuthenticated = false,
  userEmail = null
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      toast({
        title: "Search",
        description: `Searching for "${searchQuery}"...`,
      });
      setIsSearchOpen(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        description: "Signed out successfully",
        variant: "default",
      });
      navigate('/login');
    } catch (error) {
      toast({
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  // Dashboard navigation items
  const dashboardNavItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Video className="h-5 w-5" />, label: 'My Videos', path: '/dashboard/videos' },
    { icon: <Plus className="h-5 w-5" />, label: 'Create', path: '/dashboard/generate' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/dashboard/settings' },
  ];

  // Public navigation items
  const publicNavItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Home', path: '/' },
    { icon: <Video className="h-5 w-5" />, label: 'Features', path: '/#features' },
    { icon: <Plus className="h-5 w-5" />, label: 'Pricing', path: '/#pricing' },
  ];

  // Determine which nav items to use based on authentication status
  const navItems = isAuthenticated ? dashboardNavItems : publicNavItems;

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path) || location.hash === path;
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-aurora-black/80 backdrop-blur-xl z-50 border-b border-white/10 md:hidden">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <div className="relative">
              <img
                src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
                alt="Aurora"
                className="h-8 w-8 object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
            </div>
            <span className="text-xl font-orbitron font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green">
              Aurora
            </span>
          </Link>

          {/* Top Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm bg-aurora-black/95 backdrop-blur-xl border-white/10 p-0">
                <div className="flex flex-col h-full">
                  {/* User Info or Login Button */}
                  <div className="p-6 border-b border-white/10">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-aurora-blue">My Account</h3>
                        <p className="text-sm text-gray-400">{userEmail}</p>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue
                                 hover:from-aurora-blue hover:to-aurora-purple"
                      >
                        Sign In
                      </Button>
                    )}
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                                    ${isActive(item.path) 
                                      ? 'bg-aurora-blue/20 text-aurora-blue' 
                                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Bottom Actions */}
                  {isAuthenticated && (
                    <div className="p-4 border-t border-white/10">
                      <Button 
                        variant="outline"
                        className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Collapsible Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/10 bg-aurora-black/90 backdrop-blur-xl"
            >
              <form onSubmit={handleSearch} className="p-3 flex items-center">
                <Input
                  type="search"
                  placeholder="Search videos..."
                  className="flex-1 bg-white/5 border-white/10 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  className="ml-2"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-aurora-black/80 backdrop-blur-xl z-50 border-t border-white/10 md:hidden">
        <div className="grid grid-cols-4 h-full">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors
                        ${isActive(item.path) 
                          ? 'text-aurora-blue' 
                          : 'text-gray-400 hover:text-white'
                        }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
              {isActive(item.path) && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 h-0.5 w-12 bg-aurora-blue"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Content Padding for Mobile */}
      <div className="md:hidden h-14 w-full" />
      <div className="md:hidden h-16 w-full" />
    </>
  );
};
