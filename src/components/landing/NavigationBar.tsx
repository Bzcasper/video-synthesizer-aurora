
import React, { useEffect, useState, useRef } from 'react';
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<null | any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUserEmail(session?.user?.email || null);
      setIsLoading(false);
    };

    fetchUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserEmail(session?.user?.email || null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    const loadingToast = toast({
      description: "Signing out..."
    });
    
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#testimonials', label: 'Testimonials' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path) || location.hash === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-golden ${
      isScrolled ? 'bg-aurora-black/80 backdrop-blur-xl shadow-[0_0_20px_rgba(138,43,226,0.3)]' 
                 : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`relative transition-golden ${
                isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}>
                <img
                  src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
                  alt="Aurora Video Synth"
                  className={`h-10 w-10 object-contain logo-hover
                            ${isLoading ? 'logo-preloader' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
              </div>
              <span className="ml-2 text-2xl font-orbitron font-bold bg-clip-text text-transparent 
                             bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green">
                Aurora
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative font-medium transition-colors duration-200
                          after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 
                          after:bg-aurora-blue after:origin-bottom-right after:transition-transform after:duration-300
                          ${isActive(link.href) 
                            ? 'text-aurora-white after:scale-x-100' 
                            : 'text-aurora-white/70 hover:text-aurora-white after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left'
                          }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-aurora-blue rounded-full"
                    layoutId="navIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </a>
            ))}

            <AnimatePresence mode="wait">
              {session ? (
                <motion.div
                  key="user-menu"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-aurora-blue">
                        <span className="truncate max-w-[150px]">{userEmail || 'User'}</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-aurora-black/90 backdrop-blur-xl border-aurora-blue/30 text-white">
                      <DropdownMenuLabel className="text-aurora-blue">My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-white/5 hover:text-aurora-blue cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="hover:bg-white/5 hover:text-aurora-blue cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem onClick={handleSignOut} className="hover:bg-white/5 hover:text-aurora-blue cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <motion.div
                  key="login-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-aurora-purple to-aurora-blue
                             hover:from-aurora-blue hover:to-aurora-purple
                             shadow-lg hover:shadow-aurora-blue/50
                             transition-golden scale-100 hover:scale-105"
                  >
                    Sign In
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-aurora-white hover:text-aurora-blue 
                       transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={userMenuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-aurora-black/90 backdrop-blur-xl border-t border-white/10 rounded-b-lg shadow-lg"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`block transition-colors duration-200 px-6 py-2.5 rounded-lg
                              ${isActive(link.href) 
                                ? 'text-aurora-blue bg-white/5 font-medium' 
                                : 'text-aurora-white/80 hover:text-aurora-white hover:bg-white/5'
                              }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                
                {session ? (
                  <div className="p-4 border-t border-white/10 mt-2 space-y-2">
                    <div className="text-sm text-aurora-blue font-medium">
                      {userEmail}
                    </div>
                    <div className="space-y-1">
                      <Button 
                        variant="outline"
                        className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-aurora-blue"
                        onClick={() => {
                          navigate('/dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-aurora-blue"
                        onClick={() => {
                          navigate('/dashboard/settings');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-aurora-blue"
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pt-2 pb-4">
                    <Button 
                      onClick={() => { 
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue
                              hover:from-aurora-blue hover:to-aurora-purple
                              shadow-lg hover:shadow-aurora-blue/50
                              transition-golden"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavigationBar;
