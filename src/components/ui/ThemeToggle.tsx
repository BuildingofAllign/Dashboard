
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeToggleProps {
  className?: string;
  showTooltip?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '',
  showTooltip = true
}) => {
  const { theme, toggleTheme } = useTheme();
  
  const toggle = (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`h-9 w-9 rounded-full transition-all duration-200 hover:scale-110 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700" />
      )}
      <span className="sr-only">
        {theme === 'dark' ? 'Skift til lyst tema' : 'Skift til mørkt tema'}
      </span>
    </Button>
  );
  
  if (!showTooltip) {
    return toggle;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {toggle}
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme === 'dark' ? 'Skift til lyst tema' : 'Skift til mørkt tema'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
