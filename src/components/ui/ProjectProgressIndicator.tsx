
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export type StatusType = "aktiv" | "ikke-startet" | "afsluttet" | "standset" | string;

interface ProjectProgressIndicatorProps {
  progress: number;
  status: StatusType | string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
  showTooltip?: boolean;
}

export const ProjectProgressIndicator: React.FC<ProjectProgressIndicatorProps> = ({
  progress,
  status,
  size = "md",
  showLabel = false,
  showIcon = true,
  className,
  showTooltip = true,
}) => {
  const normalizedProgress = Math.min(Math.max(0, progress), 100);
  
  const sizeConfig = {
    sm: { height: "h-1.5", textSize: "text-xs", iconSize: "h-3.5 w-3.5" },
    md: { height: "h-2", textSize: "text-sm", iconSize: "h-4 w-4" },
    lg: { height: "h-3", textSize: "text-base", iconSize: "h-5 w-5" },
  };
  
  const statusConfig: Record<string, { 
    color: string, 
    icon: React.ElementType,
    indicatorClass: string,
    label: string 
  }> = {
    "afsluttet": { 
      color: "text-green-600", 
      icon: CheckCircle2,
      indicatorClass: "bg-green-500",
      label: "Afsluttet" 
    },
    "aktiv": { 
      color: "text-blue-600", 
      icon: Clock,
      indicatorClass: "bg-blue-500",
      label: "Aktiv" 
    },
    "ikke-startet": { 
      color: "text-gray-500", 
      icon: Clock,
      indicatorClass: "bg-gray-400",
      label: "Ikke startet" 
    },
    "standset": { 
      color: "text-red-600", 
      icon: AlertCircle,
      indicatorClass: "bg-red-500",
      label: "Standset" 
    },
  };
  
  // Default to 'aktiv' if status is not recognized
  const statusKey = Object.keys(statusConfig).includes(status) ? status : "aktiv";
  const { color, icon: Icon, indicatorClass, label } = statusConfig[statusKey];
  
  const progressComponent = (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <div className="flex items-center gap-1.5">
            {showIcon && <Icon className={cn(sizeConfig[size].iconSize, color)} />}
            <span className={cn(sizeConfig[size].textSize, "font-medium", color)}>
              {label}
            </span>
          </div>
        )}
        <span className={cn(sizeConfig[size].textSize, "font-medium")}>
          {normalizedProgress}%
        </span>
      </div>
      <Progress 
        value={normalizedProgress} 
        className={cn(sizeConfig[size].height, "bg-secondary")}
        indicatorClassName={cn(indicatorClass)}
      />
    </div>
  );
  
  if (!showTooltip) {
    return progressComponent;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {progressComponent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{label} - {normalizedProgress}% færdig</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
