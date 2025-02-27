
import React from 'react';
import { IconProps, createGradientIcon } from './icon-utils';

export const LogoutIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="url(#logout-gradient)" fillOpacity="0.2"/>
      <path d="M36 24L28 32V26H18V22H28V16L36 24ZM22 12H14C12.9 12 12 12.9 12 14V34C12 35.1 12.9 36 14 36H22C23.1 36 24 35.1 24 34V30H22V34H14V14H22V18H24V14C24 12.9 23.1 12 22 12Z" fill="currentColor"/>
      <defs>
        {createGradientIcon('logout')}
      </defs>
    </svg>
  );
};
