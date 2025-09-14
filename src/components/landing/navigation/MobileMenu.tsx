import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: Array<{ href: string; label: string }>;
  session: any | null;
  userEmail: string | null;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  session,
  userEmail,
  onClose,
}) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-aurora-black/90 backdrop-blur-xl border-t border-white/10 rounded-b-lg shadow-lg"
        >
          <NavLinks links={navLinks} isMobile onClick={onClose} />

          {session ? (
            <UserMenu userEmail={userEmail} isMobile onAction={onClose} />
          ) : (
            <div className="px-4 pt-2 pb-4">
              <Button
                onClick={() => {
                  navigate("/login");
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue
                        hover:from-aurora-blue hover:to-aurora-purple
                        shadow-lg hover:shadow-aurora-blue/50
                        transition-golden"
              >
                Sign In
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
