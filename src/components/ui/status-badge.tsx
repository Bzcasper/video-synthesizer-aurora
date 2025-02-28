
import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500/20 text-green-400 border-green-500/30",
        warning: "border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        error: "border-transparent bg-red-500/20 text-red-400 border-red-500/30",
        info: "border-transparent bg-blue-500/20 text-blue-400 border-blue-500/30",
        processing: "border-transparent bg-purple-500/20 text-purple-400 border-purple-500/30",
        pending: "border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        completed: "border-transparent bg-green-500/20 text-green-400 border-green-500/30",
        failed: "border-transparent bg-red-500/20 text-red-400 border-red-500/30",
      },
      size: {
        default: "text-xs py-0.5 px-2.5",
        sm: "text-[10px] py-0 px-2",
        lg: "text-sm py-1 px-3",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode;
}

export function StatusBadge({ 
  className, 
  variant, 
  size, 
  animation, 
  icon, 
  children, 
  ...props 
}: StatusBadgeProps) {
  return (
    <div
      className={cn(statusBadgeVariants({ variant, size, animation, className }))}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

// Export a more specific component for feedback states
export interface FeedbackBadgeProps extends Omit<StatusBadgeProps, 'variant'> {
  status: 'success' | 'warning' | 'error' | 'info' | 'processing' | 'pending' | 'completed' | 'failed';
}

export function FeedbackBadge({ status, ...props }: FeedbackBadgeProps) {
  // Convert status to the appropriate variant
  const variant = status as StatusBadgeProps['variant'];
  
  // Determine if animation should be applied
  const animation = ['processing', 'pending'].includes(status) ? 'pulse' as const : 'none' as const;
  
  // Map status to appropriate icon
  const getIcon = (status: FeedbackBadgeProps['status']) => {
    switch (status) {
      case 'success':
      case 'completed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
      case 'warning':
      case 'pending':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'error':
      case 'failed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case 'processing':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <StatusBadge
      variant={variant}
      animation={animation}
      icon={props.icon || getIcon(status)}
      {...props}
    />
  );
}
