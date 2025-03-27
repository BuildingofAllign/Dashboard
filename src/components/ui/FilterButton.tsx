import React from "react";

interface FilterButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="border border-gray-300 text-[15px] text-black bg-indigo-100 px-[17px] py-[9px] rounded-lg border-solid max-sm:flex-1 hover:bg-indigo-200 transition-colors"
    >
      {children}
    </button>
  );
};
