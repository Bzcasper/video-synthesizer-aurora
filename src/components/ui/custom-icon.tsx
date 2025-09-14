import React from "react";
import {
  Home,
  Video,
  Wand2 as Enhance,
  SquareStack as Batch,
  Film as Videos,
  BarChart2 as Stats,
  Settings,
  HelpCircle as Help,
  Sliders as Advanced,
  Play,
  Loader as Processing,
  LogOut,
  Menu,
  FileType as Template,
  Key as Api,
  File as Default,
} from "lucide-react";

// Interface for the CustomIcon component
interface CustomIconProps {
  name: string;
  className?: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  name,
  className = "h-5 w-5",
}) => {
  // Map icon name to Lucide component
  switch (name) {
    case "home":
      return <Home className={className} />;
    case "generate":
      return <Video className={className} />;
    case "enhance":
      return <Enhance className={className} />;
    case "batch":
      return <Batch className={className} />;
    case "videos":
      return <Videos className={className} />;
    case "stats":
      return <Stats className={className} />;
    case "settings":
      return <Settings className={className} />;
    case "help":
      return <Help className={className} />;
    case "advanced":
      return <Advanced className={className} />;
    case "play":
      return <Play className={className} />;
    case "processing":
      return <Processing className={className} />;
    case "logout":
      return <LogOut className={className} />;
    case "menu":
      return <Menu className={className} />;
    case "template":
      return <Template className={className} />;
    case "api":
      return <Api className={className} />;
    default:
      return <Default className={className} />;
  }
};

// Add a default export to maintain compatibility with existing code
export default CustomIcon;
export { CustomIcon };
export type { CustomIconProps };
