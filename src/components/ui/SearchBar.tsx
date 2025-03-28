
import React, { useState, useRef, useEffect } from "react";
import { SearchIcon, X, ArrowUpRight, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CommandList, CommandGroup, CommandItem, Command } from "@/components/ui/command";

interface SearchBarProps {
  placeholder: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  value?: string;
  className?: string;
  suggestedSearches?: string[];
  recentSearches?: string[];
  showSuggestions?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onChange,
  onClear,
  onSearch,
  value = "",
  className,
  suggestedSearches = [],
  recentSearches = [],
  showSuggestions = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && (suggestedSearches.length > 0 || recentSearches.length > 0)) {
      setShowDropdown(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    
    if (showSuggestions) {
      setShowDropdown(newValue.length > 0 || (suggestedSearches.length > 0 || recentSearches.length > 0));
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChange?.(suggestion);
    onSearch?.(suggestion);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(value);
      setShowDropdown(false);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div 
      ref={searchRef} 
      className={cn(
        "relative w-full md:w-64 group",
        className
      )}
    >
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          value={value}
          className={cn(
            "w-full pl-10 pr-8 py-2 text-[15px] transition-all border-input",
            isFocused ? "border-primary ring-1 ring-primary/30" : "group-hover:border-primary/50"
          )}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <SearchIcon className={cn(
            "h-4 w-4",
            isFocused ? "text-primary" : "group-hover:text-primary/70"
          )} />
        </div>
        {value && onClear && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 opacity-70 hover:opacity-100 hover:bg-primary/10"
            onClick={onClear}
            type="button"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showDropdown && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-10 overflow-hidden">
          <Command>
            <CommandList>
              {recentSearches.length > 0 && (
                <CommandGroup heading="Seneste søgninger">
                  {recentSearches.map((search, index) => (
                    <CommandItem 
                      key={`recent-${index}`}
                      onSelect={() => handleSelectSuggestion(search)}
                      className="flex items-center gap-2 text-sm py-1 px-2"
                    >
                      <History className="h-3.5 w-3.5 text-muted-foreground" />
                      {search}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {suggestedSearches.length > 0 && (
                <CommandGroup heading="Foreslåede søgninger">
                  {suggestedSearches.map((search, index) => (
                    <CommandItem 
                      key={`suggested-${index}`}
                      onSelect={() => handleSelectSuggestion(search)}
                      className="flex items-center gap-2 text-sm py-1 px-2"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                      {search}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
