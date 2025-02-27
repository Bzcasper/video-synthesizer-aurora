
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPassword } from '@/components/auth/ForgotPassword';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { LoginSuccessMessage } from '@/components/auth/LoginSuccessMessage';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLoginSuccess = () => {
    setIsLoggingIn(true);
    setLoginSuccess(true);
    
    // Show success message briefly before redirecting
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  // If we're checking auth status or authenticated, show loading
  if (isAuthenticated && !loginSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Get header content based on current state
  const getHeaderContent = () => {
    if (loginSuccess) {
      return {
        title: 'Login Successful',
        description: 'Redirecting you to your dashboard'
      };
    }
    if (forgotPassword) {
      return {
        title: 'Reset Password',
        description: 'Enter your email to receive reset instructions'
      };
    }
    return {
      title: 'Welcome Back',
      description: 'Enter your credentials to access your account'
    };
  };

  const { title, description } = getHeaderContent();

  return (
    <div className="flex flex-col min-h-screen bg-aurora-black">
      <div className="flex flex-1 items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={loginSuccess ? 'success' : forgotPassword ? 'reset' : 'login'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="glass-panel border-aurora-blue/30 shadow-lg shadow-aurora-blue/10">
              <CardHeader className="space-y-1">
                <AuthHeader title={title} description={description} />
              </CardHeader>
              <CardContent>
                {loginSuccess ? (
                  <LoginSuccessMessage />
                ) : forgotPassword ? (
                  <ForgotPassword 
                    email={email}
                    setEmail={setEmail}
                    onBack={() => setForgotPassword(false)}
                  />
                ) : (
                  <LoginForm 
                    email={email}
                    setEmail={setEmail}
                    onForgotPassword={() => setForgotPassword(true)}
                    onLoginSuccess={handleLoginSuccess}
                    isLoggingIn={isLoggingIn}
                    setIsLoggingIn={setIsLoggingIn}
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

export default Login;
