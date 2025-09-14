import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LoginButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={() => navigate("/login")}
        className="bg-gradient-to-r from-aurora-purple to-aurora-blue
                 hover:from-aurora-blue hover:to-aurora-purple
                 shadow-lg hover:shadow-aurora-blue/50
                 transition-golden scale-100 hover:scale-105"
      >
        Sign In
      </Button>
    </motion.div>
  );
};

export default LoginButton;
