
import React from 'react';
import { LayoutGrid, List, LayoutList, GalleryHorizontal } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type ViewMode = 'grid' | 'rows' | 'list';

interface ViewToggleProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onChange }) => {
  return (
    <TooltipProvider>
      <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onChange(value as ViewMode)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gitter visning</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="rows" aria-label="Row view">
              <GalleryHorizontal className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Række visning</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
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
