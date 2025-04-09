import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useTheme } from "@/hooks/use-theme";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { DashboardLayout } from "../App";

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  
  // Update dateTime every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedDate = format(
    dateTime,
    "EEEE 'den' d. MMMM yyyy", 
    { locale: da }
  );

  // Capitalized first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
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
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <Header 
          title="Dashboard" 
          userInitials="BL"
          subTitle={capitalizedDate}
        />
        
        <div className={cn(
          "flex-1 overflow-auto relative",
          isDarkMode ? "bg-background" : "bg-gray-50"
        )}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-muted-foreground">Indlæser dashboard...</p>
              </div>
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
    </DashboardLayout>
  );
};

export default Dashboard;
