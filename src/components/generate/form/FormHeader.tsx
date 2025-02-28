
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h2 className="text-2xl font-bold flex items-center gap-2 text-gradient">
        <Sparkles className="h-5 w-5 text-aurora-blue" />
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default FormHeader;
