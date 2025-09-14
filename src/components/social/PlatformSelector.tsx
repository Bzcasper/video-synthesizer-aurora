import React from "react";
import { Platform } from "@/types/social";
import { Instagram, Play, Youtube } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PlatformOption {
  id: Platform;
  name: string;
  icon: React.ReactNode;
  aspectRatio: string;
  description: string;
}

const platforms: PlatformOption[] = [
  {
    id: "instagram",
    name: "Instagram Reels",
    icon: <Instagram className="h-6 w-6 text-pink-500" />,
    aspectRatio: "9:16",
    description: "Vertical short-form videos up to 60 seconds",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <Play className="h-6 w-6 text-blue-500" />,
    aspectRatio: "9:16",
    description: "Vertical videos up to 3 minutes with trending audio",
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    icon: <Youtube className="h-6 w-6 text-red-500" />,
    aspectRatio: "9:16",
    description: "Vertical videos up to 60 seconds for YouTube",
  },
  {
    id: "facebook",
    name: "Facebook Reels",
    icon: <Play className="h-6 w-6 text-blue-600" />,
    aspectRatio: "9:16",
    description: "Vertical videos for Facebook Feed and Reels",
  },
];

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onChange,
}) => {
  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 mb-2">
        Select the platforms you want to create videos for. Each platform has
        specific format requirements that will be automatically applied.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`flex items-start p-4 rounded-lg border transition-all cursor-pointer ${
              selectedPlatforms.includes(platform.id)
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-600 hover:border-gray-500"
            }`}
            onClick={() => togglePlatform(platform.id)}
          >
            <Checkbox
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={() => togglePlatform(platform.id)}
              className="mr-4 mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center mb-1">
                {platform.icon}
                <Label className="ml-2 text-base font-medium">
                  {platform.name}
                </Label>
              </div>
              <div className="text-xs text-gray-400">
                {platform.description}
              </div>
              <div className="text-xs mt-1 font-medium">
                Format: {platform.aspectRatio}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
