/** @format */

import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ForgotPasswordProps {
  email: string;
  setEmail: (email: string) => void;
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  email,
  setEmail,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        description: "Please enter your email address",
        variant: "destructive",
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
        description: "Password reset instructions sent to your email",
        variant: "default",
      });
    } catch (error: unknown) {
      toast({
        description:
          error instanceof Error
            ? error.message
            : "Error sending reset instructions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="text-center space-y-4">
        <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg">
          Password reset instructions have been sent to your email.
        </div>

        <p className="text-gray-400">
          Please check your inbox and follow the instructions to reset your
          password.
        </p>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            onBack();
            setResetSent(false);
          }}
          className="w-full text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Instructions"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Button>
    </form>
  );
};
