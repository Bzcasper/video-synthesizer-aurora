
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { SceneCard } from './scene/SceneCard';
import { Scene } from './scene/types';

interface SceneEditorProps {
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
}

export const SceneEditor: React.FC<SceneEditorProps> = ({ scenes, setScenes }) => {
  const addScene = () => {
    const newScene: Scene = {
      prompt: '',
      sceneType: 'realistic_outdoor',
      cameraMotion: 'static',
      duration: 5,
      sequenceOrder: scenes.length,
    };
    setScenes([...scenes, newScene]);
  };

  const removeScene = (index: number) => {
    const newScenes = scenes.filter((_, i) => i !== index);
    // Update sequence orders
    setScenes(newScenes.map((scene, i) => ({ ...scene, sequenceOrder: i })));
  };

  const updateScene = (index: number, updates: Partial<Scene>) => {
    const newScenes = scenes.map((scene, i) => 
      i === index ? { ...scene, ...updates } : scene
    );
    setScenes(newScenes);
  };

  const moveScene = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === scenes.length - 1)) return;
    
    const newScenes = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]];
    // Update sequence orders
    setScenes(newScenes.map((scene, i) => ({ ...scene, sequenceOrder: i })));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scene Customization</h3>
        <Button onClick={addScene} className="btn-fibonacci-sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Scene
        </Button>
      </div>

      <div className="space-y-4">
        {scenes.map((scene, index) => (
          <SceneCard
            key={index}
            scene={scene}
            index={index}
            totalScenes={scenes.length}
            onMoveScene={moveScene}
            onRemoveScene={removeScene}
            onUpdateScene={updateScene}
          />
        ))}
      </div>
    </div>
  );
};
