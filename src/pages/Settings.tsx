
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";

type SettingsTab = "profile" | "account" | "appearance" | "notifications" | "display";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="flex flex-col h-full">
      <Header title="Indstillinger" userInitials="BL" />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mb-6">
            Manage your account settings and set e-mail preferences.
          </p>
          
          <div className="border-t border-border my-6"></div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            <div className="md:w-3/4">
              {activeTab === "profile" && <ProfileSettings />}
              {activeTab === "account" && <AccountSettings />}
              {activeTab === "appearance" && <AppearanceSettings />}
              {activeTab === "notifications" && <NotificationsSettings />}
              {activeTab === "display" && <DisplaySettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
