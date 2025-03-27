
import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CommandItem
} from "@/components/ui/command"

export interface FilterOptionProps {
  value: string
  label: string
  isSelected: boolean
  onSelect: () => void
  icon?: React.ComponentType<{ className?: string }>
}

export function FilterOption({ 
  value, 
  label, 
  isSelected, 
  onSelect,
  icon: Icon 
}: FilterOptionProps) {
  return (
    <CommandItem
      key={value}
      onSelect={onSelect}
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
      <span>{label}</span>
    </CommandItem>
  )
}
