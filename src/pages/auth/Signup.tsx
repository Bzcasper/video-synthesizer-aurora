
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { z } from 'zod';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password requirements
  const requirements = [
    { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
    { id: 'uppercase', label: 'At least one uppercase letter', regex: /[A-Z]/ },
    { id: 'lowercase', label: 'At least one lowercase letter', regex: /[a-z]/ },
    { id: 'number', label: 'At least one number', regex: /[0-9]/ },
    { id: 'special', label: 'At least one special character', regex: /[^A-Za-z0-9]/ },
  ];

  useEffect(() => {
    // Update password strength
    const password = formData.password;
    let strength = 0;
    
    requirements.forEach(req => {
      if (req.regex.test(password)) {
        strength += 20; // 20% per requirement
      }
    });
    
    setPasswordStrength(strength);
    
    // Clear errors when form data changes
    if (Object.keys(errors).length > 0) {
      validateField(formData);
    }
  }, [formData]);

  const validateField = (data: typeof formData) => {
    try {
      signupSchema.parse(data);
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
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
      
      navigate('/verify-email');
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle specific error messages
      if (error.message.includes("User already registered")) {
        setErrors({ email: "This email is already registered" });
      } else {
        setErrors({ general: error.message });
      }

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-700';
    if (passwordStrength <= 40) return 'bg-red-500';
    if (passwordStrength <= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <>
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold text-white font-orbitron"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Create Account
        </motion.h2>
        <motion.p 
          className="mt-2 text-aurora-blue/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Start creating amazing videos with AI
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
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full bg-white/5 border-${errors.email ? 'red-500/50' : 'white/10'} focus-visible:border-${errors.email ? 'red-500/70' : 'aurora-blue/50'} text-white`}
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full bg-white/5 border-${errors.password ? 'red-500/50' : 'white/10'} focus-visible:border-${errors.password ? 'red-500/70' : 'aurora-blue/50'} text-white`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
          
          {/* Password strength indicator */}
          {formData.password.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Password strength</span>
                <span className={`font-medium ${
                  passwordStrength <= 40 ? 'text-red-400' : 
                  passwordStrength <= 80 ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>
                  {passwordStrength <= 40 ? 'Weak' : 
                   passwordStrength <= 80 ? 'Medium' : 
                   'Strong'}
                </span>
              </div>
              <Progress value={passwordStrength} className="h-1.5" indicatorClassName={getStrengthColor()} />
              
              <div className="space-y-2 mt-3">
                {requirements.map((req) => (
                  <div key={req.id} className="flex items-center text-xs">
                    {req.regex.test(formData.password) ? (
                      <Check className="h-3.5 w-3.5 text-green-400 mr-2" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-gray-400 mr-2" />
                    )}
                    <span className={req.regex.test(formData.password) ? 'text-gray-300' : 'text-gray-400'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full bg-white/5 border-${errors.confirmPassword ? 'red-500/50' : 'white/10'} focus-visible:border-${errors.confirmPassword ? 'red-500/70' : 'aurora-blue/50'} text-white`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
          )}
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
              <span className="ml-2">Creating account...</span>
            </div>
          ) : (
            "Sign up"
          )}
        </Button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-aurora-blue/90 hover:text-aurora-blue transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
};

export default Signup;
