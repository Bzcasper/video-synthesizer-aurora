
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { SignupForm } from '@/components/auth/SignupForm';
import { SignupSuccessMessage } from '@/components/auth/SignupSuccessMessage';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume logged in initially to prevent flash

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      } else {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, [navigate]);

  // If we're checking auth status or authenticated, show loading
  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-aurora-black">
      <div className="flex flex-1 items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={signupComplete ? 'complete' : 'signup'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="glass-panel border-aurora-blue/30 shadow-lg shadow-aurora-blue/10">
              <CardHeader className="space-y-1">
                <AuthHeader 
                  title={signupComplete ? 'Welcome to Aurora' : 'Create an Account'} 
                  description={signupComplete 
                    ? 'Your account has been created successfully' 
                    : 'Fill out the form below to create your Aurora account'
                  } 
                />
              </CardHeader>
              <CardContent>
                {signupComplete ? (
                  <SignupSuccessMessage onBackToSignup={() => setSignupComplete(false)} />
                ) : (
                  <SignupForm 
                    onSignupComplete={() => setSignupComplete(true)}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-center text-xs text-gray-500">
                Protected by Aurora Security
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Signup;
