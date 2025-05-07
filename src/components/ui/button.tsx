import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 interactive-border border-2", // Added interactive-border and border-2
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent hover:bg-background hover:text-primary", // Updated hover state
        destructive:
          "bg-destructive text-destructive-foreground border-transparent hover:bg-background hover:text-destructive", // Added consistent hover for destructive
        outline:
          "border-input bg-background hover:text-primary", // Changed hover:text-accent-foreground to hover:text-primary for better visibility
        secondary:
          "bg-secondary text-secondary-foreground border-transparent hover:bg-background hover:text-secondary-foreground", // Added consistent hover for secondary
        ghost: "hover:text-primary border-transparent", // Changed hover:text-accent-foreground to hover:text-primary for better visibility
        link: "text-primary underline-offset-4 hover:underline hover:text-accent border-transparent", // Added border-transparent for consistency if border effect is desired
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))} // Removed "button-hover-effect"
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="loading-dots" aria-label="Loading">
            <span />
            <span />
            <span />
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

