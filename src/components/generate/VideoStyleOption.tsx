
import React from 'react';
import { motion } from "framer-motion";

interface VideoStyleOptionProps {
  id: string;
  label: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const VideoStyleOption = ({ id, label, description, isSelected, onSelect }: VideoStyleOptionProps) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(id)}
      className={`p-4 rounded-lg text-left transition-all ${
        isSelected 
          ? 'bg-gradient-to-r from-aurora-purple to-aurora-blue border-none shadow-neon' 
          : 'bg-white/5 border border-white/10 hover:border-aurora-blue/50'
      }`}
    >
      <div className="font-medium">{label}</div>
      <div className="text-sm text-gray-400 mt-1">{description}</div>
    </motion.button>
  );
};

export default VideoStyleOption;
