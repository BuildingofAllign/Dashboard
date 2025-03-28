
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useTheme } from "@/hooks/use-theme";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Simulate initial loading
  useEffect(() => {
    // First loading phase - just show spinner
    const timer1 = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    // Second loading phase - reveal content with animation
    const timer2 = setTimeout(() => {
      setPageLoaded(true);
    }, 650);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" userInitials="BL" />
      
      <div className={cn(
        "flex-1 overflow-auto relative",
        isDarkMode ? "bg-background" : "bg-gray-50"
      )}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            pageLoaded 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          )}>
            <DashboardContent />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
