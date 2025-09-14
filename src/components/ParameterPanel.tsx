import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParameterPanelProps {
  onParamsChange?: (params: VideoParams) => void;
}

export interface VideoParams {
  duration: number;
  fps: number;
  stylePrompt: string;
  prompt: string;
  style: string;
  model: "sdxl" | "modelscope" | "llava";
  enhanceFrames: boolean;
  lipSync: boolean;
  resolution: {
    width: number;
    height: number;
  };
  quality: "draft" | "standard" | "high";
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ onParamsChange }) => {
  const [params, setParams] = useState<VideoParams>({
    duration: 10,
    fps: 30,
    stylePrompt: "",
    prompt: "",
    style: "",
    model: "sdxl",
    enhanceFrames: true,
    lipSync: false,
    resolution: {
      width: 1920,
      height: 1080,
    },
    quality: "standard",
  });

  const handleParamChange = <K extends keyof VideoParams>(
    key: K,
    value: VideoParams[K],
  ) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParamsChange?.(newParams);
  };

  const handleResolutionChange = (value: "sd" | "hd" | "4k") => {
    const resolutions = {
      sd: { width: 1280, height: 720 },
      hd: { width: 1920, height: 1080 },
      "4k": { width: 3840, height: 2160 },
    };
    handleParamChange("resolution", resolutions[value]);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Parameters</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Generation Model</Label>
          <RadioGroup
            value={params.model}
            onValueChange={(value) =>
              handleParamChange("model", value as VideoParams["model"])
            }
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sdxl" id="sdxl" />
              <Label htmlFor="sdxl">Stable Diffusion XL</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="modelscope" id="modelscope" />
              <Label htmlFor="modelscope">ModelScope</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="llava" id="llava" />
              <Label htmlFor="llava">LLaVA</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Resolution</Label>
          <Select
            value={
              params.resolution.width === 1280
                ? "sd"
                : params.resolution.width === 1920
                  ? "hd"
                  : "4k"
            }
            onValueChange={handleResolutionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sd">Standard (720p)</SelectItem>
              <SelectItem value="hd">HD (1080p)</SelectItem>
              <SelectItem value="4k">4K</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Quality Preset</Label>
          <Select
            value={params.quality}
            onValueChange={(value) =>
              handleParamChange("quality", value as VideoParams["quality"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft (Faster)</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="high">High Quality (Slower)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Style</Label>
          <Input
            placeholder="Enter style..."
            className="bg-background/50"
            value={params.style}
            onChange={(e) => handleParamChange("style", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Prompt</Label>
          <Input
            placeholder="Enter prompt..."
            className="bg-background/50"
            value={params.prompt}
            onChange={(e) => handleParamChange("prompt", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Style Prompt</Label>
          <Input
            placeholder="Enter style description..."
            className="bg-background/50"
            value={params.stylePrompt}
            onChange={(e) => handleParamChange("stylePrompt", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Duration (seconds)</Label>
          <Slider
            value={[params.duration]}
            onValueChange={([value]) => handleParamChange("duration", value)}
            min={1}
            max={60}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{params.duration}s</p>
        </div>

        <div className="space-y-2">
          <Label>Frames per Second</Label>
          <Slider
            value={[params.fps]}
            onValueChange={([value]) => handleParamChange("fps", value)}
            min={24}
            max={60}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{params.fps} FPS</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Frame Enhancement</Label>
            <Switch
              checked={params.enhanceFrames}
              onCheckedChange={(checked) =>
                handleParamChange("enhanceFrames", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Lip Sync</Label>
            <Switch
              checked={params.lipSync}
              onCheckedChange={(checked) =>
                handleParamChange("lipSync", checked)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterPanel;
