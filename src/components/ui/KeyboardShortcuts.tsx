
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = () => {
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const shortcuts: Shortcut[] = [
    {
      key: 'd',
      description: 'Gå til Dashboard',
      action: () => navigate('/dashboard')
    },
    {
      key: 'p',
      description: 'Gå til Projekter',
      action: () => navigate('/projekter')
    },
    {
      key: 't',
      description: 'Gå til Tegninger',
      action: () => navigate('/tegninger')
    },
    {
      key: 'a',
      description: 'Gå til Afvigelser',
      action: () => navigate('/afvigelser')
    },
    {
      key: 'l',
      description: 'Gå til Tillægsopgaver',
      action: () => navigate('/tillagsopgaver')
    },
    {
      key: 'k',
      description: 'Gå til Kvalitetssikring',
      action: () => navigate('/kvalitetssikring')
    },
    {
      key: '?',
      description: 'Vis tastatur genveje',
      action: () => setShowShortcutsDialog(true)
    },
    {
      key: 'Escape',
      description: 'Luk dialog',
      action: () => setShowShortcutsDialog(false)
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Check if alt or ctrl is pressed with the key
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const shortcut = shortcuts.find(s => s.key.toLowerCase() === event.key.toLowerCase());
      
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
        
        // Show toast for navigation shortcuts
        if (shortcut.key !== '?' && shortcut.key !== 'Escape') {
          toast({
            title: 'Tastatur genvej',
            description: shortcut.description,
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, navigate, toast]);

  return {
    showShortcutsDialog,
    setShowShortcutsDialog,
    shortcuts
  };
};

export const KeyboardShortcutsDialog: React.FC = () => {
  const { showShortcutsDialog, setShowShortcutsDialog, shortcuts } = useKeyboardShortcuts();

  return (
    <Dialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tastatur Genveje</DialogTitle>
          <DialogDescription>
            Brug disse genveje for hurtig navigation i applikationen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{shortcut.description}</span>
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
