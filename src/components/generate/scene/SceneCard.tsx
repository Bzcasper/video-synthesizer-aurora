
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SceneControls } from './SceneControls';
import { SceneFormFields } from './SceneFormFields';
import { Scene } from './types';
import { motion } from "framer-motion";

interface SceneCardProps {
  scene: Scene;
  index: number;
  totalScenes: number;
  onMoveScene: (index: number, direction: 'up' | 'down') => void;
  onRemoveScene: (index: number) => void;
  onUpdateScene: (index: number, updates: Partial<Scene>) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  index,
  totalScenes,
  onMoveScene,
  onRemoveScene,
  onUpdateScene,
}) => {
  const handleUpdateScene = (updates: Partial<Scene>) => {
    onUpdateScene(index, updates);
  };

  const isPromptValid = scene.prompt.length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        key={index} 
        className={`glass-panel hover-glow transition-colors duration-300 ${
          !isPromptValid ? 'border-red-500/50' : 'border-white/10'
        }`}
      >
        <CardContent className="pt-4 space-y-4">
          <div className="flex justify-between gap-4">
            <SceneFormFields 
              scene={scene}
              index={index}
              isLastScene={index === totalScenes - 1}
              updateScene={handleUpdateScene}
            />
            
            <SceneControls 
              index={index}
              totalScenes={totalScenes}
              onMoveUp={() => onMoveScene(index, 'up')}
              onMoveDown={() => onMoveScene(index, 'down')}
              onRemove={() => onRemoveScene(index)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
