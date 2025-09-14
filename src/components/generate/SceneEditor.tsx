import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SceneCard } from "./scene/SceneCard";
import { Scene, sceneSchema } from "./scene/types";
import { AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface SceneEditorProps {
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
}

export const SceneEditor: React.FC<SceneEditorProps> = ({
  scenes,
  setScenes,
}) => {
  const addScene = () => {
    const newScene: Scene = {
      prompt: "",
      sceneType: "realistic_outdoor",
      cameraMotion: "static",
      duration: 5,
      sequenceOrder: scenes.length,
      transitionType: "fade",
    };

    setScenes([...scenes, newScene]);

    // Show a helpful toast when first scene is added
    if (scenes.length === 0) {
      toast({
        title: "Scene added!",
        description:
          "Customize each scene to create your perfect video sequence.",
      });
    }
  };

  const removeScene = (index: number) => {
    // Prevent removing the last scene
    if (scenes.length <= 1) {
      toast({
        title: "Cannot remove scene",
        description: "Your video must have at least one scene.",
        variant: "destructive",
      });
      return;
    }

    const newScenes = scenes.filter((_, i) => i !== index);
    // Update sequence orders
    setScenes(newScenes.map((scene, i) => ({ ...scene, sequenceOrder: i })));
  };

  const updateScene = (index: number, updates: Partial<Scene>) => {
    const newScenes = scenes.map((scene, i) =>
      i === index ? { ...scene, ...updates } : scene,
    );
    setScenes(newScenes);

    // Validate the updated scene
    const updatedScene = { ...scenes[index], ...updates };
    const validationResult = sceneSchema.safeParse(updatedScene);

    // We'll only show toasts for specific important validation errors
    if (!validationResult.success) {
      const error = validationResult.error.errors[0];
      // Only show error toast for empty prompt when user is typing
      if (error.path.includes("prompt") && updatedScene.prompt === "") {
        toast({
          title: "Scene description required",
          description: "Please add a description for your scene.",
          variant: "destructive",
        });
      }
    }
  };

  const moveScene = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === scenes.length - 1)
    )
      return;

    const newScenes = [...scenes];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    [newScenes[index], newScenes[targetIndex]] = [
      newScenes[targetIndex],
      newScenes[index],
    ];
    // Update sequence orders
    setScenes(newScenes.map((scene, i) => ({ ...scene, sequenceOrder: i })));
  };

  const hasNoScenes = scenes.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scene Customization</h3>
        <Button
          onClick={addScene}
          variant="secondary"
          className="bg-aurora-purple text-white hover:bg-aurora-purple/90 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {hasNoScenes ? "Create First Scene" : "Add Scene"}
        </Button>
      </div>

      {hasNoScenes ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">
            No scenes created yet. Add your first scene to start customizing
            your video.
          </p>
          <Button
            onClick={addScene}
            variant="outline"
            className="hover:bg-aurora-blue/20"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create First Scene
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {scenes.map((scene, index) => (
              <SceneCard
                key={`scene-${index}`}
                scene={scene}
                index={index}
                totalScenes={scenes.length}
                onMoveScene={moveScene}
                onRemoveScene={removeScene}
                onUpdateScene={updateScene}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
