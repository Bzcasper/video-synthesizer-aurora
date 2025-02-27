
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Lock, Key, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume logged in initially to prevent flash

  // Password validation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasNumber: false,
    hasSpecial: false,
    hasUppercase: false,
  });

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

  // Validate password as user types
  useEffect(() => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    
    let score = 0;
    if (hasMinLength) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    if (hasUppercase) score++;
    
    setPasswordStrength({
      score,
      hasMinLength,
      hasNumber,
      hasSpecial,
      hasUppercase,
    });
  }, [password]);

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score === 0) return 'bg-gray-500';
    if (score === 1) return 'bg-red-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const { score } = passwordStrength;
    if (score === 0) return 'Too Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      toast({
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    if (passwordStrength.score < 3) {
      toast({
        description: 'Please use a stronger password',
        variant: 'destructive',
      });
      return;
    }
    
    if (!agreedToTerms) {
      toast({
        description: 'You must agree to the Terms of Service',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;
      
      setSignupComplete(true);
      toast({
        description: 'Account created successfully!',
      });
    } catch (error: any) {
      toast({
        description: error.message || 'Error creating account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signupForm = (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 bg-black/30 border-white/10 focus:border-aurora-blue/50"
            disabled={isLoading}
          />
        </div>
      </div>
      
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
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 bg-black/30 border-white/10 focus:border-aurora-blue/50"
            disabled={isLoading}
          />
        </div>
        
        {/* Password strength indicator */}
        {password.length > 0 && (
          <div className="space-y-2 animate-in fade-in-50 duration-300">
            <div className="flex justify-between items-center">
              <div className="text-xs font-medium">Password Strength: {getPasswordStrengthText()}</div>
              <div className="text-xs text-gray-400">{passwordStrength.score}/4</div>
            </div>
            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
              />
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <li className={passwordStrength.hasMinLength ? "text-green-500" : "text-gray-400"}>
                • At least 8 characters
              </li>
              <li className={passwordStrength.hasUppercase ? "text-green-500" : "text-gray-400"}>
                • At least 1 uppercase letter
              </li>
              <li className={passwordStrength.hasNumber ? "text-green-500" : "text-gray-400"}>
                • At least 1 number
              </li>
              <li className={passwordStrength.hasSpecial ? "text-green-500" : "text-gray-400"}>
                • At least 1 special character
              </li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`pl-10 bg-black/30 border-white/10 focus:border-aurora-blue/50 ${
              confirmPassword && password !== confirmPassword ? "border-red-500" : ""
            }`}
            disabled={isLoading}
          />
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-red-500">Passwords do not match</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          disabled={isLoading}
        />
        <label
          htmlFor="terms"
          className="text-sm text-gray-400 leading-none cursor-pointer"
        >
          I agree to the{' '}
          <Link 
            to="/terms" 
            className="text-aurora-blue hover:text-aurora-blue/80 transition-colors"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link 
            to="/privacy" 
            className="text-aurora-blue hover:text-aurora-blue/80 transition-colors"
          >
            Privacy Policy
          </Link>
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                 hover:from-aurora-blue hover:to-aurora-purple shadow-lg transition-all"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
      
      <div className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-aurora-blue hover:text-aurora-blue/80 transition-colors">
          Sign in
        </Link>
      </div>
    </form>
  );

  const signupCompleteMessage = (
    <div className="text-center space-y-6 py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mx-auto bg-green-500/20 text-green-400 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Account Created Successfully!</h3>
        <p className="text-gray-400 mb-4">
          Please check your email to verify your account. Once verified, you can log in to your account.
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={() => navigate('/login')}
          className="w-full"
        >
          Go to Login
        </Button>
        
        <button
          type="button"
          onClick={() => setSignupComplete(false)}
          className="w-full flex items-center justify-center text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to signup
        </button>
      </div>
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
            key={signupComplete ? 'complete' : 'signup'}
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
                  {signupComplete ? 'Welcome to Aurora' : 'Create an Account'}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {signupComplete 
                    ? 'Your account has been created successfully' 
                    : 'Fill out the form below to create your Aurora account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {signupComplete ? signupCompleteMessage : signupForm}
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
