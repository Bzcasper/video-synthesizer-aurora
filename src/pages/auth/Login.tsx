
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const redirectPath = location.state?.from || '/dashboard';

  useEffect(() => {
    // Clear errors when form data changes
    if (Object.keys(errors).length > 0) {
      validateField(formData);
    }
  }, [formData]);

  const validateField = (data: typeof formData) => {
    try {
      loginSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach(err => {
          const path = err.path[0] as keyof typeof formData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateField(formData)) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      toast.success("Welcome back!");
      navigate(redirectPath);
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle specific error messages
      if (error.message.includes("Invalid login")) {
        setErrors({ general: "Invalid email or password" });
      } else if (error.message.includes("Email not confirmed")) {
        setErrors({ general: "Please verify your email before signing in" });
      } else {
        setErrors({ general: error.message });
      }

      toast.error("Sign in failed", {
        description: error.message
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold font-orbitron text-white mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Welcome Back
        </motion.h2>
        <motion.p 
          className="text-aurora-blue/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Sign in to continue to Aurora
        </motion.p>
      </div>

      {errors.general && (
        <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30 text-white">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-100">
            {errors.general}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-200">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full pr-10 bg-white/5 border-${errors.email ? 'red-500/50' : 'white/10'} focus-visible:border-${errors.email ? 'red-500/70' : 'aurora-blue/50'} text-white`}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-200">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full pr-10 bg-white/5 border-${errors.password ? 'red-500/50' : 'white/10'} focus-visible:border-${errors.password ? 'red-500/70' : 'aurora-blue/50'} text-white`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link
            to="/reset-password"
            className="font-medium text-aurora-blue/90 hover:text-aurora-blue transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple
                   transition-golden shadow-lg shadow-aurora-blue/20 hover:shadow-aurora-blue/40"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Signing in...</span>
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-aurora-blue/90 hover:text-aurora-blue transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </>
  );
};

export default Login;
