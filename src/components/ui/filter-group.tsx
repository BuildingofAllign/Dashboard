
import * as React from "react"
import {
  CommandGroup,
  CommandSeparator,
} from "@/components/ui/command"
import { FilterOption } from "@/components/ui/filter-option"

export interface FilterGroupProps {
  title: string
  options: Array<{
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }>
  selectedOptions: readonly string[]
  onSelect: (option: string) => void
  index: number
}

export function FilterGroup({
  title,
  options,
  selectedOptions,
  onSelect,
  index
}: FilterGroupProps) {
  return (
    <React.Fragment>
      {index > 0 && <CommandSeparator />}
      <CommandGroup heading={title}>
        {options.map((option) => (
          <FilterOption
            key={option.value}
            value={option.value}
            label={option.label}
            icon={option.icon}
            isSelected={selectedOptions.includes(option.value)}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </CommandGroup>
    </React.Fragment>
  )
}
