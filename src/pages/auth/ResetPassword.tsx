
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "Check your email for the password reset link",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-orbitron">Check Your Email</h2>
        <p className="text-gray-400">
          We've sent a password reset link to your email address.
        </p>
        <Link to="/login">
          <Button variant="link" className="text-aurora-blue hover:text-aurora-purple">
            Return to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white font-orbitron">Reset Password</h2>
        <p className="mt-2 text-aurora-blue">Enter your email to reset your password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Reset Password"}
        </Button>

        <p className="text-center text-sm text-gray-400">
          Remember your password?{" "}
          <Link to="/login" className="text-aurora-blue hover:text-aurora-purple transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
