
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Boxes, 
  AlertCircle, 
  ListTodo, 
  CheckCircle, 
  Settings 
} from "lucide-react";

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
  { icon: <FolderKanban className="h-5 w-5" />, label: "Projekter", path: "/projekter" },
  { icon: <Users className="h-5 w-5" />, label: "Medarbejdere", path: "/" },
  { icon: <Boxes className="h-5 w-5" />, label: "Tegninger", path: "/tegninger" },
  { icon: <AlertCircle className="h-5 w-5" />, label: "Afvigelser", path: "/afvigelser" },
  { icon: <ListTodo className="h-5 w-5" />, label: "Tillægsopgaver", path: "/tillagsopgaver" },
  { icon: <CheckCircle className="h-5 w-5" />, label: "Kvalitetssikring", path: "/kvalitetssikring" },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 flex flex-col justify-between bg-indigo-700 h-screen max-sm:hidden">
      <div className="flex flex-col h-full">
        <div className="text-white text-3xl font-bold p-8 pb-12">Allign</div>
        
        <nav className="flex flex-col gap-1 px-4 flex-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center text-white text-[16px] gap-4 p-4 rounded-lg transition-colors ${
                  isActive ? "bg-indigo-800" : "hover:bg-indigo-600"
                }`}
              >
                <div className="text-white">{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 mb-4">
          <Link
            to="/indstillinger"
            className="flex items-center text-white text-[16px] gap-4 p-4 rounded-lg transition-colors hover:bg-indigo-600"
          >
            <div className="text-white">
              <Settings className="h-5 w-5" />
            </div>
            <span>Indstillinger</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
