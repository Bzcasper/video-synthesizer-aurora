
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Settings, Video, Home, LogOut, PlusCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: PlusCircle, label: 'Generate', path: '/dashboard/generate' },
    { icon: Video, label: 'My Videos', path: '/dashboard/videos' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-aurora-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <img
              src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
              alt="Aurora"
              className="h-8 w-8"
            />
            <span className="text-xl font-orbitron font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green">
              Aurora
            </span>
          </Link>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors
                         ${isActivePath(item.path)
                  ? 'text-aurora-blue bg-aurora-blue/10 border-r-2 border-aurora-blue'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-400
                     hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
