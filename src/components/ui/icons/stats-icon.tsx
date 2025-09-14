import React from "react";
import { IconProps, createGradientIcon } from "./icon-utils";

export const StatsIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
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
        fill="url(#stats-gradient)"
        fillOpacity="0.2"
      />
      <path
        d="M34 14H14C12.9 14 12 14.9 12 16V32C12 33.1 12.9 34 14 34H34C35.1 34 36 33.1 36 32V16C36 14.9 35.1 14 34 14ZM18 28H16V22H18V28ZM24 28H22V18H24V28ZM30 28H28V24H30V28Z"
        fill="currentColor"
      />
      <defs>{createGradientIcon("stats")}</defs>
    </svg>
  );
};
