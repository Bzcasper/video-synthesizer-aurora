import React from "react";
import { IconProps, createGradientIcon } from "./icon-utils";

export const ApiIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
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
        fill="url(#api-gradient)"
        fillOpacity="0.2"
      />
      <path
        d="M24 18V14H12V34H24V30H14V16H22V18H24ZM36 24L30 30V26H24V22H30V18L36 24Z"
        fill="currentColor"
      />
      <defs>{createGradientIcon("api")}</defs>
    </svg>
  );
};
