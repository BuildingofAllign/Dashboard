
import React, { useState } from "react";
import { Bell, Download, HelpCircle, Search, Star } from "lucide-react";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KeyboardShortcutsDialog, useKeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";

interface HeaderProps {
  title: string;
  userInitials: string;
  onSearch?: (term: string) => void;
  showExport?: boolean;
  onExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  userInitials, 
  onSearch,
  showExport = false,
  onExport
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setShowShortcutsDialog } = useKeyboardShortcuts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const notifications = [
    { id: 1, title: "Ny afvigelse", message: "Afvigelse registreret på Skovvej 12", time: "10 min siden" },
    { id: 2, title: "Tegning opdateret", message: "Facade tegning er blevet opdateret", time: "1 time siden" },
    { id: 3, title: "Ny besked", message: "Boktogan har sent dig en besked", time: "3 timer siden" },
  ];

  return (
    <>
      <div className="flex justify-between items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white px-6 py-4 dark:bg-gray-800 dark:text-white">
        <div className="text-[23px] font-bold text-gray-800 dark:text-white">{title}</div>

        <div className="flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="search"
                placeholder="Søg..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3">
          {showExport && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onExport}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eksporter data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowShortcutsDialog(true)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tastatur genveje (Tryk ?)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DarkModeToggle />

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      <span className="absolute h-2 w-2 top-1 right-1 bg-red-500 rounded-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifikationer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikationer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm text-blue-600 font-medium">
                Se alle notifikationer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-10 h-10 text-white text-base font-bold bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
            {userInitials}
          </div>
        </div>
      </div>
      
      <KeyboardShortcutsDialog />
    </>
  );
};
