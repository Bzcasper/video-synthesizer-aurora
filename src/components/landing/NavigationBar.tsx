
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<null | any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navLinks = [
    { href: '#', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-aurora-black/80 backdrop-blur-xl shadow-[0_0_20px_rgba(138,43,226,0.3)]' 
                 : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`relative transition-all duration-700 ${
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
                className="text-aurora-white/90 hover:text-aurora-white relative
                         font-medium transition-colors duration-200
                         after:content-[''] after:absolute after:w-full after:scale-x-0
                         after:h-0.5 after:bottom-0 after:left-0 after:bg-aurora-blue
                         after:origin-bottom-right after:transition-transform after:duration-300
                         hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                {link.label}
              </a>
            ))}
            {session ? (
              <Button 
                onClick={handleSignOut}
                className="bg-gradient-to-r from-aurora-purple to-aurora-blue
                         hover:from-aurora-blue hover:to-aurora-purple
                         shadow-lg hover:shadow-aurora-blue/50
                         transition-all duration-300 scale-100 hover:scale-105"
              >
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-aurora-purple to-aurora-blue
                         hover:from-aurora-blue hover:to-aurora-purple
                         shadow-lg hover:shadow-aurora-blue/50
                         transition-all duration-300 scale-100 hover:scale-105"
              >
                Sign In
              </Button>
            )}
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
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-aurora-white/90 hover:text-aurora-white
                         transition-colors duration-200 px-4 py-2
                         hover:bg-white/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-4">
              {session ? (
                <Button 
                  onClick={handleSignOut}
                  className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue
                           hover:from-aurora-blue hover:to-aurora-purple
                           shadow-lg hover:shadow-aurora-blue/50
                           transition-all duration-300"
                >
                  Sign Out
                </Button>
              ) : (
                <Button 
                  onClick={() => { 
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue
                           hover:from-aurora-blue hover:to-aurora-purple
                           shadow-lg hover:shadow-aurora-blue/50
                           transition-all duration-300"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
