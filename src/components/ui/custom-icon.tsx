
import React from 'react';

interface CustomIconProps {
  name: string;
  className?: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({ name, className = "h-5 w-5" }) => {
  // Home/Dashboard icon
  if (name === 'home') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#home-gradient)" fillOpacity="0.2"/>
        <path d="M34 22.1L24 14L14 22.1V34H21V28H27V34H34V22.1Z" fill="currentColor"/>
        <defs>
          <linearGradient id="home-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Generate/Create Video icon
  if (name === 'generate') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#generate-gradient)" fillOpacity="0.2"/>
        <path d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM28 25H25V28C25 28.55 24.55 29 24 29C23.45 29 23 28.55 23 28V25H20C19.45 25 19 24.55 19 24C19 23.45 19.45 23 20 23H23V20C23 19.45 23.45 19 24 19C24.55 19 25 19.45 25 20V23H28C28.55 23 29 23.45 29 24C29 24.55 28.55 25 28 25Z" fill="currentColor"/>
        <defs>
          <linearGradient id="generate-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Enhance Video icon
  if (name === 'enhance') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#enhance-gradient)" fillOpacity="0.2"/>
        <path d="M34 14H14C12.9 14 12 14.9 12 16V32C12 33.1 12.9 34 14 34H34C35.1 34 36 33.1 36 32V16C36 14.9 35.1 14 34 14ZM24 28C21.79 28 20 26.21 20 24C20 21.79 21.79 20 24 20C26.21 20 28 21.79 28 24C28 26.21 26.21 28 24 28ZM24 18C20.69 18 18 20.69 18 24C18 27.31 20.69 30 24 30C27.31 30 30 27.31 30 24C30 20.69 27.31 18 24 18Z" fill="currentColor"/>
        <path d="M24 26C25.1046 26 26 25.1046 26 24C26 22.8954 25.1046 22 24 22C22.8954 22 22 22.8954 22 24C22 25.1046 22.8954 26 24 26Z" fill="currentColor"/>
        <defs>
          <linearGradient id="enhance-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Batch Queue icon
  if (name === 'batch') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#batch-gradient)" fillOpacity="0.2"/>
        <path d="M32 18H16C14.9 18 14 17.1 14 16C14 14.9 14.9 14 16 14H32C33.1 14 34 14.9 34 16C34 17.1 33.1 18 32 18ZM32 26H16C14.9 26 14 25.1 14 24C14 22.9 14.9 22 16 22H32C33.1 22 34 22.9 34 24C34 25.1 33.1 26 32 26ZM32 34H16C14.9 34 14 33.1 14 32C14 30.9 14.9 30 16 30H32C33.1 30 34 30.9 34 32C34 33.1 33.1 34 32 34Z" fill="currentColor"/>
        <defs>
          <linearGradient id="batch-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // My Videos icon
  if (name === 'videos') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#videos-gradient)" fillOpacity="0.2"/>
        <path d="M36 16.83V31.17C36 32.8 34.19 33.77 32.83 32.83L24 27V34C24 35.1 23.1 36 22 36H14C12.9 36 12 35.1 12 34V14C12 12.9 12.9 12 14 12H22C23.1 12 24 12.9 24 14V21L32.83 15.17C34.19 14.23 36 15.2 36 16.83Z" fill="currentColor"/>
        <defs>
          <linearGradient id="videos-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Stats/Processing Stats icon
  if (name === 'stats') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#stats-gradient)" fillOpacity="0.2"/>
        <path d="M34 14H14C12.9 14 12 14.9 12 16V32C12 33.1 12.9 34 14 34H34C35.1 34 36 33.1 36 32V16C36 14.9 35.1 14 34 14ZM18 28H16V22H18V28ZM24 28H22V18H24V28ZM30 28H28V24H30V28Z" fill="currentColor"/>
        <defs>
          <linearGradient id="stats-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Settings icon
  if (name === 'settings') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#settings-gradient)" fillOpacity="0.2"/>
        <path d="M34.59 22.5L32.38 20.29C32.45 19.68 32.5 19.09 32.5 18.5C32.5 17.91 32.45 17.32 32.38 16.71L34.6 14.49C34.89 14.2 34.96 13.75 34.78 13.36L32.78 9.64C32.6 9.26 32.16 9.09 31.78 9.22L29.06 10.34C28.17 9.64 27.19 9.07 26.13 8.65L25.67 5.79C25.61 5.36 25.22 5.05 24.78 5.05H20.78C20.34 5.05 19.95 5.36 19.89 5.79L19.43 8.65C18.37 9.07 17.39 9.64 16.5 10.34L13.78 9.22C13.39 9.08 12.96 9.26 12.78 9.64L10.78 13.36C10.6 13.75 10.67 14.2 10.96 14.49L13.18 16.71C13.11 17.32 13.06 17.91 13.06 18.5C13.06 19.09 13.11 19.68 13.18 20.29L10.96 22.51C10.67 22.8 10.6 23.25 10.78 23.64L12.78 27.36C12.96 27.74 13.4 27.91 13.78 27.78L16.5 26.66C17.39 27.36 18.37 27.93 19.43 28.35L19.89 31.21C19.95 31.64 20.34 31.95 20.78 31.95H24.78C25.22 31.95 25.61 31.64 25.67 31.21L26.13 28.35C27.19 27.93 28.17 27.36 29.06 26.66L31.78 27.78C32.17 27.92 32.6 27.74 32.78 27.36L34.78 23.64C34.96 23.25 34.89 22.8 34.6 22.51L34.59 22.5ZM22.78 23.5C20.02 23.5 17.78 21.26 17.78 18.5C17.78 15.74 20.02 13.5 22.78 13.5C25.54 13.5 27.78 15.74 27.78 18.5C27.78 21.26 25.54 23.5 22.78 23.5Z" fill="currentColor"/>
        <defs>
          <linearGradient id="settings-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Help/Question icon
  if (name === 'help') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#help-gradient)" fillOpacity="0.2"/>
        <path d="M24 14C18.5 14 14 18.5 14 24C14 29.5 18.5 34 24 34C29.5 34 34 29.5 34 24C34 18.5 29.5 14 24 14ZM24 31C23.45 31 23 30.55 23 30C23 29.45 23.45 29 24 29C24.55 29 25 29.45 25 30C25 30.55 24.55 31 24 31ZM26.53 23.67C26.07 24.01 25.7 24.5 25.5 25.12C25.46 25.29 25.37 25.44 25.24 25.55C25.1 25.67 24.93 25.74 24.76 25.75C24.65 25.76 24.54 25.75 24.43 25.71C24.32 25.68 24.22 25.63 24.14 25.56C24.05 25.49 23.98 25.4 23.92 25.3C23.87 25.19 23.83 25.08 23.82 24.97C23.8 24.67 23.83 24.37 23.91 24.08C24.03 23.64 24.23 23.23 24.5 22.87C24.79 22.47 25.15 22.12 25.56 21.84C25.97 21.56 26.19 21.1 26.18 20.62C26.16 20.2 25.96 19.81 25.64 19.53C25.32 19.26 24.91 19.12 24.49 19.15C24.14 19.15 23.81 19.27 23.54 19.5C23.27 19.72 23.09 20.03 23.03 20.37C22.99 20.64 22.82 20.88 22.56 21.01C22.31 21.14 22.01 21.15 21.75 21.04C21.49 20.93 21.29 20.7 21.22 20.43C21.1 19.75 21.28 19.05 21.69 18.5C22.1 17.95 22.71 17.59 23.4 17.5C24.25 17.38 25.1 17.6 25.79 18.12C26.47 18.64 26.92 19.42 27.02 20.28C27.12 21.12 26.88 21.97 26.36 22.64C26.22 22.85 26.05 23.04 25.86 23.21C25.67 23.38 25.51 23.58 25.39 23.79C25.26 24 25.18 24.23 25.14 24.48C25.11 24.72 25.14 24.97 25.21 25.2C25.23 25.31 25.23 25.43 25.21 25.54C25.19 25.65 25.14 25.76 25.08 25.86C25.02 25.95 24.94 26.03 24.84 26.09C24.75 26.15 24.64 26.2 24.53 26.22C24.42 26.24 24.31 26.24 24.2 26.22C24.09 26.2 23.98 26.16 23.89 26.1C23.79 26.04 23.71 25.96 23.64 25.87C23.58 25.77 23.53 25.67 23.5 25.56C23.48 25.44 23.48 25.33 23.5 25.22C23.56 24.75 23.67 24.29 23.84 23.86C24.01 23.43 24.22 23.02 24.48 22.65C24.65 22.41 24.77 22.12 24.83 21.82C24.84 21.65 24.8 21.47 24.71 21.32C24.62 21.17 24.48 21.05 24.32 20.98C24.15 20.91 23.97 20.9 23.79 20.94C23.62 20.99 23.46 21.09 23.35 21.24C23.23 21.39 23.17 21.58 23.17 21.78C23.17 21.97 23.23 22.16 23.35 22.31C23.52 22.54 23.64 22.8 23.72 23.08C23.79 23.36 23.82 23.64 23.8 23.93C23.78 24.21 23.71 24.49 23.6 24.75C23.49 25 23.33 25.23 23.14 25.43C22.95 25.63 22.72 25.79 22.47 25.9C22.21 26.01 21.94 26.08 21.66 26.1C21.38 26.12 21.1 26.09 20.82 26.02C20.54 25.94 20.28 25.82 20.05 25.65C19.59 25.32 19.25 24.85 19.08 24.31C18.9 23.77 18.9 23.18 19.07 22.63C19.24 22.09 19.58 21.62 20.03 21.29C20.49 20.95 21.04 20.78 21.6 20.79C21.73 20.79 21.86 20.8 21.99 20.83C22.11 19.87 22.58 18.99 23.3 18.36C24.02 17.73 24.95 17.38 25.92 17.38C26.75 17.36 27.56 17.6 28.25 18.07C28.93 18.54 29.45 19.21 29.72 20C29.99 20.78 30 21.63 29.75 22.42C29.5 23.21 29 23.9 28.33 24.38C27.79 24.75 27.31 25.2 26.9 25.71C26.81 25.83 26.69 25.93 26.56 25.99C26.42 26.05 26.27 26.08 26.12 26.07C25.96 26.06 25.82 26.01 25.69 25.94C25.57 25.86 25.47 25.75 25.4 25.61C25.33 25.48 25.29 25.33 25.3 25.17C25.3 25.02 25.35 24.87 25.42 24.74C25.72 24.31 26.07 23.93 26.49 23.6L26.53 23.67Z" fill="currentColor"/>
        <defs>
          <linearGradient id="help-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // API/Advanced icon
  if (name === 'advanced') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#advanced-gradient)" fillOpacity="0.2"/>
        <path d="M38 24C38 31.73 31.73 38 24 38C16.27 38 10 31.73 10 24C10 16.27 16.27 10 24 10C31.73 10 38 16.27 38 24ZM24 13C17.92 13 13 17.92 13 24C13 30.08 17.92 35 24 35C30.08 35 35 30.08 35 24C35 17.92 30.08 13 24 13ZM27 24C27 22.34 25.66 21 24 21C22.34 21 21 22.34 21 24C21 25.66 22.34 27 24 27C25.66 27 27 25.66 27 24Z" fill="currentColor"/>
        <defs>
          <linearGradient id="advanced-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Play icon
  if (name === 'play') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="24" fill="url(#play-gradient)" fillOpacity="0.2"/>
        <path d="M32 24L20 32V16L32 24Z" fill="currentColor"/>
        <defs>
          <linearGradient id="play-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Processing icon
  if (name === 'processing') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#processing-gradient)" fillOpacity="0.2"/>
        <path d="M37.17 25C36.52 30.1 32.27 34 27 34C21.22 34 16.5 29.28 16.5 23.5C16.5 18.23 20.4 13.98 25.5 13.33C25.77 13.3 26 13.53 26 13.8V19C26 19.55 26.45 20 27 20H32.2C32.47 20 32.7 20.23 32.67 20.5C32.42 22.03 31.82 23.46 30.94 24.69L28.12 21.87C27.73 21.48 27.1 21.48 26.71 21.87C26.32 22.26 26.32 22.89 26.71 23.28L29.56 26.12C28.3 27.3 26.7 28.11 24.92 28.41C22.54 28.84 20.17 28.02 18.46 26.28C16.74 24.55 15.93 22.15 16.4 19.76C16.87 17.37 18.67 15.38 21 14.65C23.33 13.92 25.89 14.52 27.69 16.31C28.08 16.7 28.71 16.7 29.1 16.31C29.49 15.92 29.49 15.29 29.1 14.9C26.65 12.46 23.08 11.63 19.8 12.63C16.52 13.63 14.04 16.35 13.35 19.72C12.66 23.08 13.83 26.55 16.47 28.92C19.11 31.28 22.73 32.09 26.06 31.05C29.38 30.01 32 27.33 32.91 24.01H35.8C36.07 24.01 36.3 24.24 36.27 24.51L37.17 25Z" fill="currentColor"/>
        <defs>
          <linearGradient id="processing-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Logout icon
  if (name === 'logout') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#logout-gradient)" fillOpacity="0.2"/>
        <path d="M36 24L28 32V26H18V22H28V16L36 24ZM22 12H14C12.9 12 12 12.9 12 14V34C12 35.1 12.9 36 14 36H22C23.1 36 24 35.1 24 34V30H22V34H14V14H22V18H24V14C24 12.9 23.1 12 22 12Z" fill="currentColor"/>
        <defs>
          <linearGradient id="logout-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Menu icon
  if (name === 'menu') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#menu-gradient)" fillOpacity="0.2"/>
        <path d="M12 34H36V32H12V34ZM12 25H36V23H12V25ZM12 14V16H36V14H12Z" fill="currentColor"/>
        <defs>
          <linearGradient id="menu-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Template icon
  if (name === 'template') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#template-gradient)" fillOpacity="0.2"/>
        <path d="M36 16H32V12H36V16ZM28 12V16H20V12H28ZM16 12V16H12V12H16ZM36 20H12V36H36V20Z" fill="currentColor"/>
        <defs>
          <linearGradient id="template-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // API icon
  if (name === 'api') {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="url(#api-gradient)" fillOpacity="0.2"/>
        <path d="M24 18V14H12V34H24V30H14V16H22V18H24ZM36 24L30 30V26H24V22H30V18L36 24Z" fill="currentColor"/>
        <defs>
          <linearGradient id="api-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="0.5" stopColor="#00A6FF"/>
            <stop offset="1" stopColor="#00FFAA"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  // Default icon for any other unmatched cases
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
};

export default CustomIcon;
