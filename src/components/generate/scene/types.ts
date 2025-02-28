
import { type Database } from "@/integrations/supabase/types";

export type SceneType = Database["public"]["Enums"]["scene_type"];
export type CameraMotion = Database["public"]["Enums"]["camera_motion_type"];

export interface Scene {
  prompt: string;
  sceneType: SceneType;
  cameraMotion: CameraMotion;
  duration: number;
  sequenceOrder: number;
  transitionType?: string;
}
