
import React from 'react';

// Import all icons
import { HomeIcon } from './home-icon';
import { GenerateIcon } from './generate-icon';
import { EnhanceIcon } from './enhance-icon';
import { BatchIcon } from './batch-icon';
import { VideosIcon } from './videos-icon';
import { StatsIcon } from './stats-icon';
import { SettingsIcon } from './settings-icon';
import { HelpIcon } from './help-icon';
import { AdvancedIcon } from './advanced-icon';
import { PlayIcon } from './play-icon';
import { ProcessingIcon } from './processing-icon';
import { LogoutIcon } from './logout-icon';
import { MenuIcon } from './menu-icon';
import { TemplateIcon } from './template-icon';
import { ApiIcon } from './api-icon';
import { DefaultIcon } from './default-icon';
import { ClockIcon } from './clock-icon';

// Interface for the CustomIcon component
interface CustomIconProps {
  name: string;
  className?: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({ name, className = "h-5 w-5" }) => {
  // Map icon name to component
  switch (name) {
    case 'home':
      return <HomeIcon className={className} />;
    case 'generate':
      return <GenerateIcon className={className} />;
    case 'enhance':
      return <EnhanceIcon className={className} />;
    case 'batch':
      return <BatchIcon className={className} />;
    case 'videos':
      return <VideosIcon className={className} />;
    case 'stats':
      return <StatsIcon className={className} />;
    case 'settings':
      return <SettingsIcon className={className} />;
    case 'help':
      return <HelpIcon className={className} />;
    case 'advanced':
      return <AdvancedIcon className={className} />;
    case 'play':
      return <PlayIcon className={className} />;
    case 'processing':
      return <ProcessingIcon className={className} />;
    case 'logout':
      return <LogoutIcon className={className} />;
    case 'menu':
      return <MenuIcon className={className} />;
    case 'template':
      return <TemplateIcon className={className} />;
    case 'api':
      return <ApiIcon className={className} />;
    case 'clock':
      return <ClockIcon className={className} />;
    default:
      return <DefaultIcon className={className} />;
  }
};

export { CustomIcon };
export type { CustomIconProps };

// Also export individual icon components
export { 
  HomeIcon,
  GenerateIcon,
  EnhanceIcon,
  BatchIcon,
  VideosIcon,
  StatsIcon,
  SettingsIcon,
  HelpIcon,
  AdvancedIcon,
  PlayIcon,
  ProcessingIcon,
  LogoutIcon,
  MenuIcon,
  TemplateIcon,
  ApiIcon,
  ClockIcon,
  DefaultIcon
};
