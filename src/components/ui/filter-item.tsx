
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

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
        active:
          "border border-primary bg-primary/10 text-primary shadow-sm",
      },
      size: {
        default: "h-8 px-3 py-1",
        sm: "h-7 px-2 text-xs",
        lg: "h-10 px-3",
      },
      removable: {
        true: "pr-1",
        false: "",
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
      removable: false
    },
    compoundVariants: [
      {
        removable: true,
        size: "sm",
        class: "pr-1"
      },
      {
        removable: true,
        size: "default",
        class: "pr-1"
      },
      {
        removable: true,
        size: "lg",
        class: "pr-2"
      }
    ]
  }
)

export interface FilterItemProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filterItemVariants> {
  selected?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

const FilterItem = React.forwardRef<
  HTMLDivElement,
  FilterItemProps
>(({ className, variant, size, removable, selected, onRemove, icon, children, ...props }, ref) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div
      ref={ref}
      className={cn(filterItemVariants({ 
        variant: selected ? "active" : variant, 
        size, 
        removable, 
        className 
      }))}
      {...props}
    >
      {selected && (
        <Check className="mr-1 h-3.5 w-3.5 shrink-0" />
      )}
      
      {icon && (
        <span className="mr-1.5 shrink-0">{icon}</span>
      )}
      
      <span className="truncate">{children}</span>
      
      {removable && (
        <button
          type="button"
          className={cn(
            "ml-1 rounded-full p-0.5 bg-transparent",
            "hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary",
            "transition-colors"
          )}
          onClick={handleRemoveClick}
          aria-label="Remove"
        >
          <X className={cn(
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5",
            "text-muted-foreground hover:text-foreground"
          )} />
        </button>
      )}
    </div>
  );
});

FilterItem.displayName = "FilterItem"

export { FilterItem, filterItemVariants }
