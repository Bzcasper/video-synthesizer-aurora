
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthLayout = ({ children, requireAuth = false }: AuthLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (requireAuth && !session) {
          setIsTransitioning(true);
          setTimeout(() => navigate('/login'), 300);
        } else if (!requireAuth && session) {
          setIsTransitioning(true);
          setTimeout(() => navigate('/dashboard'), 300);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (requireAuth && !session) {
        setIsTransitioning(true);
        setTimeout(() => navigate('/login'), 300);
      } else if (!requireAuth && session) {
        setIsTransitioning(true);
        setTimeout(() => navigate('/dashboard'), 300);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, requireAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-aurora-black flex items-center justify-center">
        <div className="relative">
          <img
            src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
            alt="Loading..."
            className="w-16 h-16 animate-spin-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aurora-black">
      <div className="fixed inset-0 bg-gradient-to-br from-aurora-purple/10 via-aurora-blue/5 to-aurora-green/10 pointer-events-none" />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`relative z-10 ${isTransitioning ? 'pointer-events-none' : ''}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout;
