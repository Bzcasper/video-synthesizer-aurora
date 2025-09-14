/** @format */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-neon-blue disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-aurora-blue text-white hover:bg-aurora-blue/90 hover:shadow-neon-blue hover:shadow-lg hover:-translate-y-0.5",
        destructive:
          "bg-error text-error-foreground hover:bg-error/90 hover:shadow-neon-orange",
        success:
          "bg-success text-success-foreground hover:bg-success/90 hover:shadow-neon-green",
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-neon-orange",
        info: "bg-info text-info-foreground hover:bg-info/90 hover:shadow-neon-blue",
        outline:
          "border border-aurora-blue/50 bg-background hover:border-aurora-blue hover:bg-aurora-blue/10 hover:text-aurora-blue hover:shadow-neon-blue hover:shadow-md",
        secondary:
          "bg-aurora-purple text-white hover:bg-aurora-purple/90 hover:shadow-neon-purple hover:shadow-lg",
        cyan: "bg-aurora-cyan text-aurora-black hover:bg-aurora-cyan/90 hover:shadow-neon-cyan hover:shadow-lg",
        orange:
          "bg-aurora-orange text-white hover:bg-aurora-orange/90 hover:shadow-neon-orange hover:shadow-lg",
        ghost: "hover:bg-aurora-blue/10 hover:text-aurora-blue hover:shadow-sm",
        link: "text-aurora-blue underline-offset-4 hover:underline hover:text-aurora-cyan",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 rounded-md text-xs",
        lg: "h-12 px-6 rounded-lg text-base",
        xl: "h-14 px-8 rounded-xl text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
