
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Video, 
  Wand2, 
  SquareStack, 
  Film, 
  BarChart2, 
  Settings, 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavItems: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Video className="h-5 w-5" />, label: 'Generate Video', path: '/dashboard/generate' },
    { icon: <Wand2 className="h-5 w-5" />, label: 'Enhance Video', path: '/dashboard/enhance' },
    { icon: <SquareStack className="h-5 w-5" />, label: 'Batch Queue', path: '/dashboard/batch' },
    { icon: <Film className="h-5 w-5" />, label: 'My Videos', path: '/dashboard/videos' },
    { icon: <BarChart2 className="h-5 w-5" />, label: 'Processing Stats', path: '/dashboard/stats' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
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
  );
};
