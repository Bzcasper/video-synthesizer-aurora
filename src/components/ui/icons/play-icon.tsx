import React from "react";
import { IconProps, createGradientIcon } from "./icon-utils";

export const PlayIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="48"
        height="48"
        rx="24"
        fill="url(#play-gradient)"
        fillOpacity="0.2"
      />
      <path d="M32 24L20 32V16L32 24Z" fill="currentColor" />
      <defs>{createGradientIcon("play")}</defs>
    </svg>
  );
};
