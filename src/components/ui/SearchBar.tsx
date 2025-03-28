
import React from "react";
import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SearchBarProps {
  placeholder: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  value?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onChange,
  onClear,
  value,
  className,
}) => {
  return (
    <div className={cn("relative w-full md:w-64", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
        className="w-full pl-10 pr-4 py-2 text-[15px]"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <SearchIcon className="h-4 w-4" />
      </div>
      {value && onClear && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
          onClick={onClear}
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
