
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { type Database } from "@/integrations/supabase/types";
import { PlusCircle, MinusCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

type SceneType = Database["public"]["Enums"]["scene_type"];
type CameraMotion = Database["public"]["Enums"]["camera_motion_type"];

interface Scene {
  prompt: string;
  sceneType: SceneType;
  cameraMotion: CameraMotion;
  duration: number;
  sequenceOrder: number;
  transitionType?: string;
}

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
          <Card key={index} className="glass-panel hover-glow">
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Scene Description</label>
                  <Textarea
                    value={scene.prompt}
                    onChange={(e) => updateScene(index, { prompt: e.target.value })}
                    placeholder="Describe the scene..."
                    className="h-[100px]"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => moveScene(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => moveScene(index, 'down')}
                    disabled={index === scenes.length - 1}
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeScene(index)}
                  >
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Scene Type</label>
                  <Select
                    value={scene.sceneType}
                    onValueChange={(value: SceneType) => 
                      updateScene(index, { sceneType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="realistic_outdoor">Realistic Outdoor</SelectItem>
                      <SelectItem value="scifi_interior">Sci-fi Interior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Camera Motion</label>
                  <Select
                    value={scene.cameraMotion}
                    onValueChange={(value: CameraMotion) => 
                      updateScene(index, { cameraMotion: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select motion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="pan_left">Pan Left</SelectItem>
                      <SelectItem value="pan_right">Pan Right</SelectItem>
                      <SelectItem value="zoom_in">Zoom In</SelectItem>
                      <SelectItem value="zoom_out">Zoom Out</SelectItem>
                      <SelectItem value="tracking">Tracking Shot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Duration (seconds)</label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={scene.duration}
                    onChange={(e) => updateScene(index, { 
                      duration: Math.max(1, Math.min(30, parseInt(e.target.value) || 1))
                    })}
                  />
                </div>
              </div>

              {index < scenes.length - 1 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Transition</label>
                  <Select
                    value={scene.transitionType || 'none'}
                    onValueChange={(value) => 
                      updateScene(index, { transitionType: value === 'none' ? undefined : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="dissolve">Dissolve</SelectItem>
                      <SelectItem value="wipe">Wipe</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
