import React from "react";
import { IconProps, createGradientIcon } from "./icon-utils";

export const HomeIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
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
        rx="8"
        fill="url(#home-gradient)"
        fillOpacity="0.2"
      />
      <path
        d="M34 22.1L24 14L14 22.1V34H21V28H27V34H34V22.1Z"
        fill="currentColor"
      />
      <defs>{createGradientIcon("home")}</defs>
    </svg>
  );
};
