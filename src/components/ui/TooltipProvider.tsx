
import React from 'react';
import { TooltipProvider as RadixTooltipProvider } from '@/components/ui/tooltip';

/**
 * Global TooltipProvider to wrap around components that use tooltips
 */
export const GlobalTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <RadixTooltipProvider>{children}</RadixTooltipProvider>;
};
