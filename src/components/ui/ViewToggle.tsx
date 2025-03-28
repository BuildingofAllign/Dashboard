
import React from 'react';
import { LayoutGrid, List, LayoutList, GalleryHorizontal } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type ViewMode = 'grid' | 'rows' | 'list';

interface ViewToggleProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
  gridIcon?: React.ReactNode;
  listIcon?: React.ReactNode;
  rowsIcon?: React.ReactNode;
  
  // Add the aliases for backward compatibility
  viewMode?: ViewMode;
  onViewModeChange?: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ 
  currentView, 
  onChange,
  gridIcon = <LayoutGrid className="h-4 w-4" />,
  listIcon = <List className="h-4 w-4" />,
  rowsIcon = <GalleryHorizontal className="h-4 w-4" />,
  
  // Use provided viewMode or currentView
  viewMode,
  onViewModeChange
}) => {
  // Use the props that are provided, falling back to the primary props
  const activeView = viewMode || currentView;
  const handleChange = onViewModeChange || onChange;
  
  return (
    <TooltipProvider>
      <ToggleGroup type="single" value={activeView} onValueChange={(value) => value && handleChange(value as ViewMode)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              {gridIcon}
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gitter visning</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="rows" aria-label="Row view">
              {rowsIcon}
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Række visning</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="list" aria-label="List view">
              {listIcon}
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Liste visning</p>
          </TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </TooltipProvider>
  );
};
