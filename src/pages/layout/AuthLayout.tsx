import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/components/ui/use-toast";
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
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        const hasSession = !!data.session;
        if (requireAuth && !hasSession) {
          // User needs to be authenticated but isn't
          setIsTransitioning(true);
          toast({
            title: "Authentication required",
            description: "Please sign in to access this page",
            variant: "destructive",
          });

          // Store the current path to redirect back after login
          setTimeout(
            () =>
              navigate("/login", {
                state: {
                  from: location.pathname,
                },
              }),
            300,
          );
        } else if (
          !requireAuth &&
          hasSession &&
          (location.pathname === "/login" ||
            location.pathname === "/signup" ||
            location.pathname === "/reset-password")
        ) {
          // User is already authenticated but on auth pages
          setIsTransitioning(true);
          toast({
            title: "Already signed in",
            description: "Redirecting to dashboard",
          });
          setTimeout(() => navigate("/dashboard"), 300);
        }
      } catch (error: any) {
        console.error("Auth check error:", error.message);
        toast({
          title: "Authentication Error",
          description: "There was a problem verifying your session",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();

    // Listen for authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (requireAuth && !session) {
        setIsTransitioning(true);
        setTimeout(
          () =>
            navigate("/login", {
              state: {
                from: location.pathname,
              },
            }),
          300,
        );
      } else if (
        !requireAuth &&
        session &&
        (location.pathname === "/login" ||
          location.pathname === "/signup" ||
          location.pathname === "/reset-password")
      ) {
        setIsTransitioning(true);
        setTimeout(() => navigate("/dashboard"), 300);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth, location.pathname]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-aurora-black flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <LoadingSpinner mode="loading" />
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
          </div>
          <p className="text-aurora-white/70 text-sm animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-aurora-black flex items-center justify-center overflow-hidden rounded-none">
      {/* Animated background elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-aurora-purple/10 via-aurora-blue/5 to-aurora-green/10 pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-aurora-purple/20 to-transparent pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-aurora-blue/20 to-transparent pointer-events-none opacity-30" />

      {/* Animated glowing orbs */}
      <div className="fixed top-1/4 left-1/4 w-fib-8 h-fib-8 rounded-full bg-aurora-purple/10 blur-3xl animate-pulse-slow opacity-30 pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-fib-7 h-fib-7 rounded-full bg-aurora-blue/10 blur-3xl animate-pulse-slow opacity-20 pointer-events-none" />
      <div className="fixed top-2/3 right-1/3 w-fib-6 h-fib-6 rounded-full bg-aurora-green/10 blur-3xl animate-pulse-slow opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -20,
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          className="rounded"
        >
          <div className="glass-panel p-8 shadow-xl px-[19px] py-[20px] rounded-full">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Aurora logo at the top */}
      <div className="fixed top-6 left-0 right-0 flex justify-center pointer-events-none z-30">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <img
              src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
              alt="Aurora Video Synth"
              className="h-8 w-8 object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
          </div>
          <span
            className="text-xl font-orbitron font-bold bg-clip-text text-transparent 
                         bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green"
          >
            Aurora
          </span>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
