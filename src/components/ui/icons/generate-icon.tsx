import React from "react";
import { IconProps, createGradientIcon } from "./icon-utils";

export const GenerateIcon: React.FC<IconProps> = ({
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
        fill="url(#generate-gradient)"
        fillOpacity="0.2"
      />
      <path
        d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM28 25H25V28C25 28.55 24.55 29 24 29C23.45 29 23 28.55 23 28V25H20C19.45 25 19 24.55 19 24C19 23.45 19.45 23 20 23H23V20C23 19.45 23.45 19 24 19C24.55 19 25 19.45 25 20V23H28C28.55 23 29 23.45 29 24C29 24.55 28.55 25 28 25Z"
        fill="currentColor"
      />
      <defs>{createGradientIcon("generate")}</defs>
    </svg>
  );
};
