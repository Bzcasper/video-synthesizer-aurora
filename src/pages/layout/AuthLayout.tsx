
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface AuthLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthLayout = ({ children, requireAuth = false }: AuthLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (requireAuth && !session) {
        navigate('/login');
      } else if (!requireAuth && session) {
        navigate('/dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (requireAuth && !session) {
        navigate('/login');
      } else if (!requireAuth && session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, requireAuth]);

  return (
    <div className="min-h-screen bg-aurora-black">
      <div className="fixed inset-0 bg-gradient-to-br from-aurora-purple/10 via-aurora-blue/5 to-aurora-green/10 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
