
import * as React from "react"
import { X } from "lucide-react"
import {
  CommandGroup,
  CommandItem,
  CommandSeparator
} from "@/components/ui/command"

export interface FilterClearActionProps {
  onClear: () => void
  hasSelectedOptions: boolean
}

export function FilterClearAction({ onClear, hasSelectedOptions }: FilterClearActionProps) {
  if (!hasSelectedOptions) return null
  
  return (
    <>
      <CommandSeparator />
      <CommandGroup>
        <CommandItem
          onSelect={onClear}
          className="justify-center text-center"
        >
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </CommandItem>
      </CommandGroup>
    </>
  )
}
