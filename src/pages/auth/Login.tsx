
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        description: 'Logged in successfully',
        variant: 'default',
      });
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        description: error.message || 'Error logging in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast({
        description: 'Password reset instructions sent to your email',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        description: error.message || 'Error sending reset instructions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginForm = (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-black/30 border-white/10 focus:border-aurora-blue/50"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={() => setForgotPassword(true)}
            className="text-xs text-aurora-blue hover:text-aurora-blue/80 transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 bg-black/30 border-white/10 focus:border-aurora-blue/50"
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                 hover:from-aurora-blue hover:to-aurora-purple shadow-lg transition-all"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log in'}
        <LogIn className="ml-2 h-4 w-4" />
      </Button>
      
      <div className="text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-aurora-blue hover:text-aurora-blue/80 transition-colors">
          Sign up
        </Link>
      </div>
    </form>
  );

  const resetPasswordForm = (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="reset-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-black/30 border-white/10 focus:border-aurora-blue/50"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Instructions'}
      </Button>
      
      <button
        type="button"
        onClick={() => setForgotPassword(false)}
        className="w-full flex items-center justify-center text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </button>
    </form>
  );

  const resetSentConfirmation = (
    <div className="text-center space-y-4">
      <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg">
        Password reset instructions have been sent to your email.
      </div>
      
      <p className="text-gray-400">
        Please check your inbox and follow the instructions to reset your password.
      </p>
      
      <button
        type="button"
        onClick={() => {
          setForgotPassword(false);
          setResetSent(false);
        }}
        className="w-full flex items-center justify-center text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </button>
    </div>
  );

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
            key={forgotPassword ? (resetSent ? 'reset-sent' : 'reset') : 'login'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="glass-panel border-aurora-blue/30 shadow-lg shadow-aurora-blue/10">
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <img
                      src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
                      alt="Aurora"
                      className="h-12 w-12"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green opacity-50 blur-lg -z-10" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-aurora-purple via-aurora-blue to-aurora-green">
                  {forgotPassword ? (resetSent ? 'Check Your Email' : 'Reset Password') : 'Welcome Back'}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {forgotPassword 
                    ? (resetSent 
                      ? 'Instructions have been sent to reset your password' 
                      : 'Enter your email to receive reset instructions')
                    : 'Enter your credentials to access your account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {forgotPassword 
                  ? (resetSent ? resetSentConfirmation : resetPasswordForm) 
                  : loginForm}
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
