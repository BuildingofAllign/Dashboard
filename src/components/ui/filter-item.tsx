
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const filterItemVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-8 px-3 py-1",
        sm: "h-7 px-2 text-xs",
        lg: "h-10 px-3",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
)

export interface FilterItemProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filterItemVariants> {}

const FilterItem = React.forwardRef<
  HTMLDivElement,
  FilterItemProps
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(filterItemVariants({ variant, size, className }))}
    {...props}
  />
))
FilterItem.displayName = "FilterItem"

export { FilterItem, filterItemVariants }
