
import React from 'react';
import { IconProps, createGradientIcon } from './icon-utils';

export const ClockIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="24" fill="url(#clock-gradient)" fillOpacity="0.2"/>
      <path d="M24 12C17.373 12 12 17.373 12 24C12 30.627 17.373 36 24 36C30.627 36 36 30.627 36 24C36 17.373 30.627 12 24 12ZM24 34C18.486 34 14 29.514 14 24C14 18.486 18.486 14 24 14C29.514 14 34 18.486 34 24C34 29.514 29.514 34 24 34Z" fill="currentColor"/>
      <path d="M25 17H23V25.414L28.293 30.707L29.707 29.293L25 24.586V17Z" fill="currentColor"/>
      <defs>
        {createGradientIcon('clock')}
      </defs>
    </svg>
  );
};
