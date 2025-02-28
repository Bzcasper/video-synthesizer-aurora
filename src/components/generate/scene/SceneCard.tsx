
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SceneControls } from './SceneControls';
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
  const handleUpdateScene = (updates: Partial<Scene>) => {
    onUpdateScene(index, updates);
  };

  return (
    <Card key={index} className="glass-panel hover-glow">
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
  );
};
