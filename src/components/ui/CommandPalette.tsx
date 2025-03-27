
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

// Get the command shortcut from localStorage or use default
const getCommandShortcut = (): { key: string; displayKey: string } => {
  const savedShortcut = localStorage.getItem('commandShortcut');
  if (savedShortcut) {
    try {
      return JSON.parse(savedShortcut);
    } catch (e) {
      console.error('Error parsing command shortcut from localStorage:', e);
    }
  }
  // Default to 'k'
  return { key: 'k', displayKey: 'K' };
};

export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const shortcut = getCommandShortcut();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Make sure Cmd+G works across all pages
      if ((e.key.toLowerCase() === shortcut.key || e.key.toLowerCase() === 'g') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [shortcut.key]);
  
  return { open, setOpen };
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange
}) => {
  const navigate = useNavigate();
  const shortcut = getCommandShortcut();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Make sure Cmd+G works across all pages
      if ((e.key.toLowerCase() === shortcut.key || e.key.toLowerCase() === 'g') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange, open, shortcut.key]);
  
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
