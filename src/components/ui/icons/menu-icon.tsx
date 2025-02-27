
import React from 'react';
import { IconProps, createGradientIcon } from './icon-utils';

export const MenuIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="url(#menu-gradient)" fillOpacity="0.2"/>
      <path d="M12 34H36V32H12V34ZM12 25H36V23H12V25ZM12 14V16H36V14H12Z" fill="currentColor"/>
      <defs>
        {createGradientIcon('menu')}
      </defs>
    </svg>
  );
};
