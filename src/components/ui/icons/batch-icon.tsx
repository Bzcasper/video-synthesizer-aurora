import React from "react";
import { IconProps, createGradientIcon } from "./icon-utils";

export const BatchIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
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
        fill="url(#batch-gradient)"
        fillOpacity="0.2"
      />
      <path
        d="M32 18H16C14.9 18 14 17.1 14 16C14 14.9 14.9 14 16 14H32C33.1 14 34 14.9 34 16C34 17.1 33.1 18 32 18ZM32 26H16C14.9 26 14 25.1 14 24C14 22.9 14.9 22 16 22H32C33.1 22 34 22.9 34 24C34 25.1 33.1 26 32 26ZM32 34H16C14.9 34 14 33.1 14 32C14 30.9 14.9 30 16 30H32C33.1 30 34 30.9 34 32C34 33.1 33.1 34 32 34Z"
        fill="currentColor"
      />
      <defs>{createGradientIcon("batch")}</defs>
    </svg>
  );
};
