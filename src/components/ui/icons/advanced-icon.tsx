import React from "react";
import { IconProps, createGradientIcon } from "./icon-utils";

export const AdvancedIcon: React.FC<IconProps> = ({
  className = "h-5 w-5",
}) => {
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
        fill="url(#advanced-gradient)"
        fillOpacity="0.2"
      />
      <path
        d="M38 24C38 31.73 31.73 38 24 38C16.27 38 10 31.73 10 24C10 16.27 16.27 10 24 10C31.73 10 38 16.27 38 24ZM24 13C17.92 13 13 17.92 13 24C13 30.08 17.92 35 24 35C30.08 35 35 30.08 35 24C35 17.92 30.08 13 24 13ZM27 24C27 22.34 25.66 21 24 21C22.34 21 21 22.34 21 24C21 25.66 22.34 27 24 27C25.66 27 27 25.66 27 24Z"
        fill="currentColor"
      />
      <defs>{createGradientIcon("advanced")}</defs>
    </svg>
  );
};
