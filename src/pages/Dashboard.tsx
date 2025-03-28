
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useTheme } from "@/hooks/use-theme";

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" userInitials="BL" />
      
      <div className="flex-1 overflow-auto">
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
