import React from "react";
import { motion } from "framer-motion";

export const LoginSuccessMessage: React.FC = () => {
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
          Login Successful!
        </h3>
        <p className="text-gray-400 mb-4">
          You will be redirected to your dashboard...
        </p>
      </div>

      <div className="flex justify-center">
        <div className="animate-pulse flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-aurora-blue rounded-full"></div>
          <div className="w-2 h-2 bg-aurora-purple rounded-full animation-delay-200"></div>
          <div className="w-2 h-2 bg-aurora-green rounded-full animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};
