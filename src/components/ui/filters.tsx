
import * as React from "react"
import { Filter, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FilterGroup } from "./filter-group"
import { FilterClearAction } from "./filter-clear-action"
import { FilterItem, filterItemVariants } from "./filter-item"

export interface FiltersOptions {
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
            <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search filters..." />
            <CommandList>
              <CommandEmpty>{emptyText ?? "No results found."}</CommandEmpty>
              
              {filtersOptions.map((filterOption, filterOptionIndex) => (
                <FilterGroup
                  key={filterOption.title}
                  title={filterOption.title}
                  options={filterOption.options}
                  selectedOptions={selected}
                  onSelect={handleSelect}
                  index={filterOptionIndex}
                />
              ))}
              
              <FilterClearAction 
                onClear={handleClear}
                hasSelectedOptions={selected.length > 0}
              />
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
Filters.displayName = "Filters"

export { Filters, FilterItem }
