
import React, { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  Files,
  Building2,
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
  SidebarFooter,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SubNavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface NavItemWithSub extends Omit<NavItem, 'path'> {
  subItems: SubNavItem[];
  isOpen?: boolean;
}

type SidebarNavItem = NavItem | NavItemWithSub;

const isNavItemWithSub = (item: SidebarNavItem): item is NavItemWithSub => {
  return 'subItems' in item;
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "Filer": true // Default to open
  });
  
  const navItems: SidebarNavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FolderKanban, label: "Projekter", path: "/projekter" },
    { icon: Building2, label: "Kunder", path: "/kunder" },
    { icon: Users, label: "Medarbejdere", path: "/" },
    { 
      icon: Files, 
      label: "Filer", 
      subItems: [
        { icon: Boxes, label: "Tegninger", path: "/tegninger" },
        { icon: AlertCircle, label: "Afvigelser", path: "/afvigelser" },
        { icon: ListTodo, label: "Tillægsopgaver", path: "/tillagsopgaver" },
      ]
    },
    { icon: CheckCircle, label: "Kvalitetssikring", path: "/kvalitetssikring" },
  ];

  const toggleSubMenu = (label: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };
  
  return (
    <>
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
                  const Icon = item.icon;
                  
                  if (isNavItemWithSub(item)) {
                    const isOpen = !!expandedItems[item.label];
                    const isActiveParent = item.subItems.some(
                      subItem => subItem.path === location.pathname
                    );

                    return (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton 
                          onClick={() => toggleSubMenu(item.label)}
                          isActive={isActiveParent}
                          tooltip={item.label}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                          {isOpen ? (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                        
                        {isOpen && (
                          <SidebarMenuSub>
                            {item.subItems.map((subItem, subIndex) => {
                              const SubIcon = subItem.icon;
                              const isActive = location.pathname === subItem.path;
                              
                              return (
                                <SidebarMenuSubItem key={subIndex}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive}
                                  >
                                    <Link to={subItem.path}>
                                      <SubIcon className="h-4 w-4" />
                                      <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  }

                  // Regular menu item without submenu
                  const isActive = location.pathname === item.path;
                  
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
                isActive={location.pathname === "/settings"}
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                  <span>Indstillinger</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </ShadcnSidebar>
    </>
  );
};
