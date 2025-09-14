import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-neutral-300 bg-surface-50 px-3 py-2 text-sm ring-offset-background transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-blue focus-visible:ring-offset-2 focus-visible:shadow-neon-blue focus-visible:border-aurora-blue disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
