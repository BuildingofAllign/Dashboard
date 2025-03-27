
import React from "react";

interface FilterButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const FilterSelect: React.FC<FilterButtonProps> = ({
  children,
  onClick,
  onChange,
  className = "",
}) => {
  return (
    <select
      onChange={(e) => {
        onChange?.(e);
        onClick?.();
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
