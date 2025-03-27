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
    <div className="relative w-64 max-sm:w-full">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border border-gray-300 text-[15px] pl-[41px] pr-[17px] pt-3 pb-[11px] rounded-lg border-solid"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <SearchIcon />
      </div>
    </div>
  );
};
