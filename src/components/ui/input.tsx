
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-fib-4 w-full rounded-lg border border-aurora-blue/20 bg-white/5 px-fib-3 py-2 text-sm transition-golden file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-aurora-blue/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aurora-blue/30 disabled:cursor-not-allowed disabled:opacity-50 hover:border-aurora-blue/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
