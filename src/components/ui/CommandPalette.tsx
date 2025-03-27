
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator
} from "@/components/ui/command";
import { 
  FileText, 
  Home, 
  Search, 
  Settings, 
  CircleCheck, 
  Calendar, 
  PlusCircle,
  Users
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange, open]);
  
  const navigateTo = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };
  
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>Ingen resultater fundet.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigateTo("/")}>
            <Home className="mr-2 h-4 w-4" />
            <span>Medarbejdere</span>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/projekter")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Projekter</span>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/afvigelser")}>
            <CircleCheck className="mr-2 h-4 w-4" />
            <span>Afvigelser</span>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/tillagsopgaver")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Tillægsopgaver</span>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/tegninger")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Tegninger</span>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Handlinger">
          <CommandItem onSelect={() => {
            onOpenChange(false);
            // Open create project modal
            document.getElementById("create-project-button")?.click();
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Opret nyt projekt</span>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/kvalitetssikring")}>
            <CircleCheck className="mr-2 h-4 w-4" />
            <span>Kvalitetssikring</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
