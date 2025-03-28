
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  onForgotPassword: () => void;
  onLoginSuccess: () => void;
  isLoggingIn: boolean;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  email, 
  setEmail, 
  onForgotPassword,
  onLoginSuccess,
  isLoggingIn,
  setIsLoggingIn
}) => {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoggingIn(true);
    
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
      
      // Call the success callback
      onLoginSuccess();
    } catch (error: any) {
      toast({
        description: error.message || 'Error logging in',
        variant: 'destructive',
      });
      setIsLoggingIn(false);
    }
  };

  return (
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
            disabled={isLoggingIn}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={onForgotPassword}
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
            disabled={isLoggingIn}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember" 
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
          disabled={isLoggingIn}
        />
        <label
          htmlFor="remember"
          className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember me
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                 hover:from-aurora-blue hover:to-aurora-purple shadow-lg transition-all"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Logging in...' : 'Log in'}
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
};
