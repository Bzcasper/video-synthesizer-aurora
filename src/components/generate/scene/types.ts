
import { type Database } from "@/integrations/supabase/types";
import { z } from "zod";

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

// Zod schema for scene validation
export const sceneSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(200, "Prompt cannot exceed 200 characters"),
  sceneType: z.enum([
    "realistic_outdoor", 
    "cinematic_close_up", 
    "abstract_scene", 
    "sci_fi_scene", 
    "animation_scene"
  ] as const),
  cameraMotion: z.enum([
    "static", 
    "pan_left", 
    "pan_right", 
    "tilt_up", 
    "tilt_down", 
    "zoom_in", 
    "zoom_out", 
    "dolly"
  ] as const),
  duration: z.number().min(1, "Duration must be at least 1 second").max(30, "Duration cannot exceed 30 seconds"),
  sequenceOrder: z.number().int().min(0),
  transitionType: z.string().optional(),
});

// Zod schema for the entire form
export const videoGenerationSchema = z.object({
  prompt: z.string().min(20, "Description must be at least 20 characters").max(500, "Description cannot exceed 500 characters"),
  style: z.string(),
  duration: z.number().min(5, "Duration must be at least 5 seconds").max(60, "Duration cannot exceed 60 seconds"),
  scenes: z.array(sceneSchema).min(1, "Add at least one scene"),
});

export type VideoGenerationFormValues = z.infer<typeof videoGenerationSchema>;
