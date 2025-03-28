
import React from "react";
import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder: string;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onChange,
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
        <SearchIcon />
      </div>
    </div>
  );
};
