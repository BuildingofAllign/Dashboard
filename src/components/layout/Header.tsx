import React from "react";
import { NotificationIcon } from "@/components/icons";

interface HeaderProps {
  title: string;
  userInitials: string;
}

export const Header: React.FC<HeaderProps> = ({ title, userInitials }) => {
  return (
    <div className="flex justify-between items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white px-6 py-4">
      <div className="text-[23px] font-bold text-gray-800">{title}</div>
      <div className="flex items-center gap-4">
        <button className="cursor-pointer bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
          <NotificationIcon />
        </button>
        <div className="w-10 h-10 text-white text-base font-bold bg-indigo-600 rounded-full flex items-center justify-center">
          {userInitials}
        </div>
      </div>
    </div>
  );
};
