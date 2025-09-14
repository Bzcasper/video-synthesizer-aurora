import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface NavLink {
  href: string;
  label: string;
}

interface NavLinksProps {
  links: NavLink[];
  isMobile?: boolean;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({
  links,
  isMobile = false,
  onClick,
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path) || location.hash === path;
  };

  // Mobile version of links
  if (isMobile) {
    return (
      <div className="py-4 space-y-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`block transition-colors duration-200 px-6 py-2.5 rounded-lg
                      ${
                        isActive(link.href)
                          ? "text-aurora-blue bg-white/5 font-medium"
                          : "text-aurora-white/80 hover:text-aurora-white hover:bg-white/5"
                      }`}
            onClick={onClick}
          >
            {link.label}
          </a>
        ))}
      </div>
    );
  }

  // Desktop version of links
  return (
    <div className="hidden md:flex items-center space-x-8">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={`relative font-medium transition-colors duration-200
                    after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 
                    after:bg-aurora-blue after:origin-bottom-right after:transition-transform after:duration-300
                    ${
                      isActive(link.href)
                        ? "text-aurora-white after:scale-x-100"
                        : "text-aurora-white/70 hover:text-aurora-white after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    }`}
        >
          {link.label}
          {isActive(link.href) && (
            <motion.span
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-aurora-blue rounded-full"
              layoutId="navIndicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </a>
      ))}
    </div>
  );
};

export default NavLinks;
