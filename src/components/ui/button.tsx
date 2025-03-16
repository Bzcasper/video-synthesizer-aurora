
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-golden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-aurora-blue text-white hover:bg-aurora-blue/90 hover:shadow-neon-blue transition-all duration-golden",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-aurora-blue/50 bg-background hover:border-aurora-blue hover:bg-aurora-blue/10 hover:text-aurora-blue hover:shadow-neon-blue transition-all duration-golden",
        secondary: "bg-aurora-purple text-white hover:bg-aurora-purple/90 hover:shadow-neon-purple transition-all duration-golden",
        ghost: "hover:bg-aurora-blue/10 hover:text-aurora-blue transition-all duration-golden",
        link: "text-aurora-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-fib-4 px-fib-3",
        sm: "h-fib-3 px-fib-2 rounded-md text-xs",
        lg: "h-fib-5 px-fib-4 rounded-lg text-base",
        icon: "h-fib-4 w-fib-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
