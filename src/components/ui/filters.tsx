
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

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

interface FiltersOptions {
  title: string
  options: Array<{
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }>
}

export interface FiltersProps {
  placeholder?: string
  emptyText?: string
  selectedOptions?: readonly string[]
  filtersOptions: readonly FiltersOptions[]
  onSelectedOptionsChange?: (options: string[]) => void
  onClearFilters?: () => void
  className?: string
}

const Filters = React.forwardRef<
  React.ElementRef<typeof Popover>,
  FiltersProps
>(
  (
    {
      placeholder,
      emptyText,
      selectedOptions,
      filtersOptions,
      onSelectedOptionsChange,
      onClearFilters,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<string[]>(
      selectedOptions ? [...selectedOptions] : []
    )

    const handleSelect = React.useCallback(
      (option: string) => {
        const isSelected = selected.includes(option)
        const newSelected = isSelected
          ? selected.filter((item) => item !== option)
          : [...selected, option]

        setSelected(newSelected)
        onSelectedOptionsChange?.(newSelected)
      },
      [onSelectedOptionsChange, selected]
    )

    const handleClear = React.useCallback(() => {
      setSelected([])
      onClearFilters?.()
    }, [onClearFilters])

    React.useEffect(() => {
      if (selectedOptions) {
        setSelected([...selectedOptions])
      }
    }, [selectedOptions])

    return (
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            ref={ref}
            className={cn("w-fit justify-between", className)}
          >
            {placeholder ?? "Filter..."}
            {selected.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 rounded-sm px-1 font-normal"
              >
                {selected.length}
              </Badge>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search filters..." />
            <CommandList>
              <CommandEmpty>{emptyText ?? "No results found."}</CommandEmpty>
              {filtersOptions.map((filterOption, filterOptionIndex) => (
                <React.Fragment key={filterOption.title}>
                  {filterOptionIndex > 0 && <CommandSeparator />}
                  <CommandGroup heading={filterOption.title}>
                    {filterOption.options.map((option) => {
                      const isSelected = selected.includes(option.value)
                      const Icon = option.icon

                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => handleSelect(option.value)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                          {Icon && (
                            <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{option.label}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </React.Fragment>
              ))}
              {selected.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleClear}
                      className="justify-center text-center"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
Filters.displayName = "Filters"

const FilterItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof filterItemVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(filterItemVariants({ variant, size, className }))}
    {...props}
  />
))
FilterItem.displayName = "FilterItem"

export { Filters, FilterItem }
