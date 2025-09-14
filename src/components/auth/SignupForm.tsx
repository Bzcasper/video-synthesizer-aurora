import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { User, Mail, Lock, Key } from "lucide-react";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface SignupFormProps {
  onSignupComplete: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSignupComplete,
  isLoading,
  setIsLoading,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Password validation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasNumber: false,
    hasSpecial: false,
    hasUppercase: false,
  });

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      toast({
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength.score < 3) {
      toast({
        description: "Please use a stronger password",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        description: "You must agree to the Terms of Service",
        variant: "destructive",
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

      onSignupComplete();
      toast({
        description: "Account created successfully!",
      });
    } catch (error: any) {
      toast({
        description: error.message || "Error creating account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
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
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
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
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
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
          <PasswordStrengthIndicator passwordStrength={passwordStrength} />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Key
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`pl-10 bg-black/30 border-white/10 focus:border-aurora-blue/50 ${
              confirmPassword && password !== confirmPassword
                ? "border-red-500"
                : ""
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
          I agree to the{" "}
          <Link
            to="/terms"
            className="text-aurora-blue hover:text-aurora-blue/80 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
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
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-aurora-blue hover:text-aurora-blue/80 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};
