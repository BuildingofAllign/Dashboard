
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const filterItemVariants = cva(
  "inline-flex items-center justify-between w-full rounded-md border border-input px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-background",
        selected: "bg-primary/10 border-primary/30 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface FilterItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filterItemVariants> {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

export const FilterItem = React.forwardRef<HTMLDivElement, FilterItemProps>(
  (
    {
      className,
      variant,
      label,
      selected,
      onSelect,
      icon,
      count,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          filterItemVariants({
            variant: selected ? "selected" : "default",
            className,
          }),
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
        onClick={!disabled ? onSelect : undefined}
        {...props}
      >
        <div className="flex items-center gap-2 truncate">
          <Checkbox checked={selected} className="transition-all" onCheckedChange={() => {}} />
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="truncate">{label}</span>
        </div>
        {typeof count === "number" && (
          <Badge
            variant="secondary"
            className="ml-2 font-normal text-xs rounded-full"
          >
            {count}
          </Badge>
        )}
      </div>
    );
  }
);

FilterItem.displayName = "FilterItem";
