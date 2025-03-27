
import React from "react";
import { Combobox, ComboboxOption } from "./Combobox";

interface FilterButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

interface FilterSelectProps extends FilterButtonProps {
  value?: string;
  options?: ComboboxOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  children,
  onClick,
  onChange,
  value = "",
  options = [],
  className = "",
  placeholder = "Select option...",
  onValueChange,
}) => {
  // If options are provided, use the Combobox
  if (options.length > 0) {
    const handleValueChange = (newValue: string) => {
      if (onValueChange) {
        onValueChange(newValue);
      }
      if (onClick) {
        onClick();
      }
    };

    return (
      <Combobox
        options={options}
        value={value}
        onChange={handleValueChange}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  // Fallback to the traditional select if no options are explicitly provided
  // (for backward compatibility with existing code)
  return (
    <select
      value={value}
      onChange={(e) => {
        onChange?.(e);
        onClick?.();
        
        // Support the new onValueChange prop with the old select
        if (onValueChange) {
          onValueChange(e.target.value);
        }
      }}
      className={`border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    >
      {children}
    </select>
  );
};

export const FilterButton: React.FC<FilterButtonProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`border border-gray-300 text-[15px] text-black bg-indigo-100 px-[17px] py-[9px] rounded-lg border-solid max-sm:flex-1 hover:bg-indigo-200 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};
