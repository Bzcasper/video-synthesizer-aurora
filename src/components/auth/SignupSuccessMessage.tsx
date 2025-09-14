import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SignupSuccessMessageProps {
  onBackToSignup: () => void;
}

export const SignupSuccessMessage: React.FC<SignupSuccessMessageProps> = ({
  onBackToSignup,
}) => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6 py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mx-auto bg-green-500/20 text-green-400 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Account Created Successfully!
        </h3>
        <p className="text-gray-400 mb-4">
          Please check your email to verify your account. Once verified, you can
          log in to your account.
        </p>
      </div>

      <div className="space-y-3">
        <Button onClick={() => navigate("/login")} className="w-full">
          Go to Login
        </Button>

        <button
          type="button"
          onClick={onBackToSignup}
          className="w-full flex items-center justify-center text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to signup
        </button>
      </div>
    </div>
  );
};
