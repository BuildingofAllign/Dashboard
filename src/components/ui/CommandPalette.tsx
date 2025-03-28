
import React, { useEffect, useState, createContext, useContext } from "react";
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

interface CommandPaletteContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType>({
  open: false,
  setOpen: () => {},
});

interface CommandPaletteProviderProps {
  children: React.ReactNode;
}

export const CommandPaletteProvider: React.FC<CommandPaletteProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Universal Cmd+G (or Ctrl+G) shortcut
      if (e.key.toLowerCase() === 'g' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
        return;
      }
      
      // Also support custom shortcut from localStorage if available
      const savedShortcut = localStorage.getItem('commandShortcut');
      if (savedShortcut) {
        try {
          const { key } = JSON.parse(savedShortcut);
          if (e.key.toLowerCase() === key.toLowerCase() && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen(open => !open);
          }
        } catch (e) {
          console.error('Error parsing command shortcut:', e);
        }
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </CommandPaletteContext.Provider>
  );
};

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
  }
  return context;
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Get the command shortcut display text
const getCommandShortcutDisplay = (): string => {
  const savedShortcut = localStorage.getItem('commandShortcut');
  if (savedShortcut) {
    try {
      const { displayKey } = JSON.parse(savedShortcut);
      return `⌘${displayKey}`;
    } catch (e) {
      console.error('Error parsing command shortcut:', e);
    }
  }
  // Default to G
  return '⌘G';
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange
}) => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };
  
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={`Søg eller skriv en kommando (${getCommandShortcutDisplay()})`} />
      <CommandList>
        <CommandEmpty>Ingen resultater fundet.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigateTo("/")}>
            <Users className="mr-2 h-4 w-4" />
            <span>Medarbejdere</span>
          </CommandItem>
          <CommandItem onSelect={() => navigateTo("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
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
          <CommandItem onSelect={() => navigateTo("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Indstillinger</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
