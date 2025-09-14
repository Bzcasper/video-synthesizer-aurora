import React from "react";
import { IconProps, createGradientIcon } from "./icon-utils";

export const TemplateIcon: React.FC<IconProps> = ({
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
        fill="url(#template-gradient)"
        fillOpacity="0.2"
      />
      <path
        d="M36 16H32V12H36V16ZM28 12V16H20V12H28ZM16 12V16H12V12H16ZM36 20H12V36H36V20Z"
        fill="currentColor"
      />
      <defs>{createGradientIcon("template")}</defs>
    </svg>
  );
};
