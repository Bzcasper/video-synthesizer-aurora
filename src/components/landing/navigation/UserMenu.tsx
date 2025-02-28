
import React from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface UserMenuProps {
  userEmail: string | null;
  isMobile?: boolean;
  onAction?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ userEmail, isMobile = false, onAction }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const loadingToast = toast({
      description: "Signing out..."
    });
    
    try {
      await supabase.auth.signOut();
      toast({
        description: "Signed out successfully",
      });
      navigate('/login');
    } catch (error) {
      toast({
        description: "Failed to sign out",
        variant: "destructive",
      });
    }

    if (onAction) onAction();
  };

  // Mobile version of the user menu
  if (isMobile) {
    return (
      <div className="p-4 border-t border-white/10 mt-2 space-y-2">
        <div className="text-sm text-aurora-blue font-medium">
          {userEmail}
        </div>
        <div className="space-y-1">
          <Button 
            variant="outline"
            className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-aurora-blue"
            onClick={() => {
              navigate('/dashboard');
              if (onAction) onAction();
            }}
          >
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant="outline"
            className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-aurora-blue"
            onClick={() => {
              navigate('/dashboard/settings');
              if (onAction) onAction();
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="outline"
            className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-aurora-blue"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  // Desktop dropdown menu
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-aurora-blue">
            <span className="truncate max-w-[150px]">{userEmail || 'User'}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-aurora-black/90 backdrop-blur-xl border-aurora-blue/30 text-white">
          <DropdownMenuLabel className="text-aurora-blue">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-white/5 hover:text-aurora-blue cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="hover:bg-white/5 hover:text-aurora-blue cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={handleSignOut} className="hover:bg-white/5 hover:text-aurora-blue cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default UserMenu;
