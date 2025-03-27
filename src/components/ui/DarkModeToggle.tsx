
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface DarkModeToggleProps {
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    toast({
      title: `${isDarkMode ? 'Lyst' : 'Mørkt'} tema aktiveret`,
      description: `Du har skiftet til ${isDarkMode ? 'lyst' : 'mørkt'} tema`,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            className={`transition-transform hover:scale-105 ${className}`}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Skift tema</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Skift til {isDarkMode ? 'lyst' : 'mørkt'} tema</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
