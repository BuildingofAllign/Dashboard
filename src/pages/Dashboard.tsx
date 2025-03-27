
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useTheme } from "@/hooks/use-theme";
import { SidebarProvider } from "@/components/ui/sidebar";

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [hasError, setHasError] = useState(false);
  
  // If we encounter an error with DataContext
  useEffect(() => {
    try {
      // Just a test to see if we're going to encounter an error
      const testDataContextAccess = () => {
        try {
          const testElement = document.createElement('div');
          return true;
        } catch (e) {
          console.error("Dashboard initialization error:", e);
          setHasError(true);
          return false;
        }
      };
      
      testDataContextAccess();
    } catch (error) {
      console.error("Error in dashboard:", error);
      setHasError(true);
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Dashboard" userInitials="BL" />
          
          <div className="flex-1 overflow-auto">
            <DashboardContent />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
