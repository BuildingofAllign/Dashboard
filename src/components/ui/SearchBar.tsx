
import React from "react";
import { SearchIcon } from "@/components/icons";

interface SearchBarProps {
  placeholder: string;
  onChange?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onChange,
}) => {
  return (
    <div className="relative w-full md:w-64">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 text-[15px] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <SearchIcon />
      </div>
    </div>
  );
};
