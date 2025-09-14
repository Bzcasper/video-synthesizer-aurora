import React from "react";

export interface IconProps {
  className?: string;
}

export const createGradientIcon = (id: string) => {
  return (
    <linearGradient
      id={`${id}-gradient`}
      x1="0"
      y1="0"
      x2="48"
      y2="48"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#8A2BE2" />
      <stop offset="0.5" stopColor="#00A6FF" />
      <stop offset="1" stopColor="#00FFAA" />
    </linearGradient>
  );
};
