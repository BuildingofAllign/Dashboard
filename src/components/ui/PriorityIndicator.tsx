
import React from 'react';
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export type Priority = 'high' | 'medium' | 'low' | 'none';

interface PriorityIndicatorProps {
  priority: Priority;
  showText?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
  priority,
  showText = true,
  showIcon = true,
  className = ""
}) => {
  const getColor = () => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getText = () => {
    switch (priority) {
      case 'high':
        return 'Høj prioritet';
      case 'medium':
        return 'Medium prioritet';
      case 'low':
        return 'Lav prioritet';
      default:
        return 'Ingen prioritet';
    }
  };
  
  const getIcon = () => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="h-3 w-3" />;
      case 'medium':
        return <ArrowUp className="h-3 w-3" />;
      case 'low':
        return <ArrowDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`${getColor()} ${className} inline-flex items-center gap-1`}
          >
            {showIcon && getIcon()}
            {showText && getText()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Projekt prioritet: {getText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
