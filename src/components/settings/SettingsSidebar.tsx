
import React from "react";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "account" | "appearance" | "notifications" | "display";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "account", label: "Account" },
    { id: "appearance", label: "Appearance" },
    { id: "notifications", label: "Notifications" },
    { id: "display", label: "Display" },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as SettingsTab)}
          className={cn(
            "px-4 py-3 text-left rounded-md transition-colors",
            activeTab === tab.id
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};
