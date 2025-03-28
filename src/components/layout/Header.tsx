
import React from "react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Bell, HelpCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  userInitials: string;
  subTitle?: string;
  backButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  userInitials,
  subTitle,
  backButton = false,
  onBack,
  actions,
  className
}) => {
  return (
    <header className={cn(
      "bg-background shadow-sm border-b py-2.5 px-6 flex items-center justify-between",
      className
    )}>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
        {subTitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subTitle}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Søg..."
            className="h-9 w-full pl-9 rounded-full bg-muted/50"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <ThemeToggle />
        
        <UserAvatar initials={userInitials} />
      </div>
    </header>
  );
};
