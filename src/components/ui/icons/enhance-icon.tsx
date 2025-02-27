
import React from 'react';
import { IconProps, createGradientIcon } from './icon-utils';

export const EnhanceIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="url(#enhance-gradient)" fillOpacity="0.2"/>
      <path d="M34 14H14C12.9 14 12 14.9 12 16V32C12 33.1 12.9 34 14 34H34C35.1 34 36 33.1 36 32V16C36 14.9 35.1 14 34 14ZM24 28C21.79 28 20 26.21 20 24C20 21.79 21.79 20 24 20C26.21 20 28 21.79 28 24C28 26.21 26.21 28 24 28ZM24 18C20.69 18 18 20.69 18 24C18 27.31 20.69 30 24 30C27.31 30 30 27.31 30 24C30 20.69 27.31 18 24 18Z" fill="currentColor"/>
      <path d="M24 26C25.1046 26 26 25.1046 26 24C26 22.8954 25.1046 22 24 22C22.8954 22 22 22.8954 22 24C22 25.1046 22.8954 26 24 26Z" fill="currentColor"/>
      <defs>
        {createGradientIcon('enhance')}
      </defs>
    </svg>
  );
};
