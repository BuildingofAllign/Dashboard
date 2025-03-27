
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
  Settings,
  LucideIcon
} from "lucide-react";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projekter", path: "/projekter" },
  { icon: Users, label: "Medarbejdere", path: "/" },
  { icon: Boxes, label: "Tegninger", path: "/tegninger" },
  { icon: AlertCircle, label: "Afvigelser", path: "/afvigelser" },
  { icon: ListTodo, label: "Tillægsopgaver", path: "/tillagsopgaver" },
  { icon: CheckCircle, label: "Kvalitetssikring", path: "/kvalitetssikring" },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <ShadcnSidebar className="border-r">
      <SidebarHeader className="flex flex-col items-start px-4 py-4">
        <div className="text-3xl font-bold text-primary">Allign</div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link to={item.path}>
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              tooltip="Indstillinger"
            >
              <Link to="/indstillinger">
                <Settings className="h-5 w-5" />
                <span>Indstillinger</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};
