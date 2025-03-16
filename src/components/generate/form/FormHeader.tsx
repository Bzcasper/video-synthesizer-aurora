
import React from 'react';
import { motion } from 'framer-motion';
import { CustomIcon } from '@/components/ui/icons';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  title, 
  subtitle,
  icon = "generate"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 border-b border-white/10 pb-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gradient-to-r from-aurora-purple to-aurora-blue p-2 rounded-lg">
          <CustomIcon name={icon} className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-gray-400 ml-10">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default FormHeader;
