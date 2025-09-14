import React from "react";
import { Camera, Upload, ImageIcon, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InputPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoGeneration: () => void;
  isProcessing: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  prompt,
  setPrompt,
  handleImageUpload,
  handleVideoGeneration,
  isProcessing,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="prompt" className="text-sm font-medium text-gray-200">
          Video Description
        </label>
        <Input
          id="prompt"
          placeholder="Describe your video..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-black/50 border-white/10 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="w-full bg-black/50 border-white/10 text-white hover:bg-white/5"
          onClick={() => document.getElementById("imageUpload")?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          variant="outline"
          className="w-full bg-black/50 border-white/10 text-white hover:bg-white/5"
        >
          <Camera className="w-4 h-4 mr-2" />
          Record Video
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="w-full bg-black/50 border-white/10 text-white hover:bg-white/5"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Stock Images
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black/50 border-white/10 text-white hover:bg-white/5"
        >
          <Film className="w-4 h-4 mr-2" />
          Stock Videos
        </Button>
      </div>

      <Button
        onClick={handleVideoGeneration}
        disabled={isProcessing || !prompt}
        className="w-full bg-aurora-blue hover:bg-aurora-blue/80 text-white"
      >
        {isProcessing ? "Processing..." : "Generate Video"}
      </Button>
    </div>
  );
};
