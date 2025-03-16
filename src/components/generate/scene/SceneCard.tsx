
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { SceneFormFields } from './SceneFormFields';
import { Scene } from './types';

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
  const handleSceneChange = (index: number, field: keyof Scene, value: any) => {
    onUpdateScene(index, { [field]: value });
  };

  const isFirst = index === 0;
  const isLast = index === totalScenes - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-panel">
        <CardHeader className="p-4 pb-0 flex flex-row justify-between items-center">
          <h3 className="text-lg font-medium">Scene {index + 1}</h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveScene(index, 'up')}
              disabled={isFirst}
              aria-label="Move scene up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveScene(index, 'down')}
              disabled={isLast}
              aria-label="Move scene down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveScene(index)}
              aria-label="Remove scene"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <SceneFormFields 
            scene={scene} 
            index={index} 
            onSceneChange={handleSceneChange} 
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
