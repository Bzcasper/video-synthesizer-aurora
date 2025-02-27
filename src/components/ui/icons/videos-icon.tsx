
import React from 'react';
import { IconProps, createGradientIcon } from './icon-utils';

export const VideosIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="url(#videos-gradient)" fillOpacity="0.2"/>
      <path d="M36 16.83V31.17C36 32.8 34.19 33.77 32.83 32.83L24 27V34C24 35.1 23.1 36 22 36H14C12.9 36 12 35.1 12 34V14C12 12.9 12.9 12 14 12H22C23.1 12 24 12.9 24 14V21L32.83 15.17C34.19 14.23 36 15.2 36 16.83Z" fill="currentColor"/>
      <defs>
        {createGradientIcon('videos')}
      </defs>
    </svg>
  );
};
