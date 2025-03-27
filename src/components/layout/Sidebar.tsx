import React from "react";
import { HomeIcon, ProjectsIcon } from "@/components/icons";

const navItems = [
  { icon: <HomeIcon />, label: "Dashboard" },
  { icon: <ProjectsIcon />, label: "Projekter" },
  // Add other navigation items...
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 flex flex-col justify-between bg-indigo-700 p-6 max-sm:hidden">
      <div>
        <div className="text-white text-2xl font-bold mb-8">Allign</div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center text-white text-[15px] cursor-pointer p-3 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <div className="w-8 h-5 flex items-center pr-3">{item.icon}</div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button className="flex items-center text-white text-[15px] cursor-pointer p-3 rounded-lg hover:bg-indigo-600 transition-colors">
        <div className="w-8 h-5 flex items-center pr-3">
          <HomeIcon />
        </div>
        <span>Indstillinger</span>
      </button>
    </div>
  );
};
