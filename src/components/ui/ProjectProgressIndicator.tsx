
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, AlertCircle, Clock } from "lucide-react";

interface ProjectProgressIndicatorProps {
  progress: number;
  status: string;
  size?: "xs" | "sm" | "md" | "lg";
  showTooltip?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const ProjectProgressIndicator: React.FC<ProjectProgressIndicatorProps> = ({
  progress,
  status,
  size = "md",
  showTooltip = true,
  showIcon = false,
  className
}) => {
  // Get appropriate color based on status
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case "problem":
        return {
          color: "bg-red-500",
          icon: AlertCircle,
          label: "Problem"
        };
      case "udfordring":
        return {
          color: "bg-yellow-500",
          icon: AlertTriangle,
          label: "Udfordring"
        };
      case "afsluttet":
        return {
          color: "bg-gray-500",
          icon: CheckCircle,
          label: "Afsluttet"
        };
      case "aktiv":
      default:
        return {
          color: "bg-green-500",
          icon: Clock,
          label: "Aktiv"
        };
    }
  };
  
  const { color, icon: StatusIcon, label } = getStatusConfig();
  
  const heightClass = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }[size];
  
  const progressBar = (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 mb-1">
        {showIcon && (
          <StatusIcon 
            className={cn("h-3.5 w-3.5", 
              status === "problem" ? "text-red-500" : 
              status === "udfordring" ? "text-yellow-500" : 
              status === "afsluttet" ? "text-gray-500" : 
              "text-green-500"
            )} 
          />
        )}
        
        <div className="flex justify-between w-full text-xs">
          <span className="text-muted-foreground">Fremgang</span>
          <span className="font-medium">{progress}%</span>
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className={cn("rounded-full bg-gray-200", heightClass)} 
        indicatorClassName={cn("rounded-full transition-all duration-300", color)}
      />
    </div>
  );
  
  if (!showTooltip) {
    return progressBar;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {progressBar}
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <StatusIcon className={cn("h-4 w-4", 
                status === "problem" ? "text-red-500" : 
                status === "udfordring" ? "text-yellow-500" : 
                status === "afsluttet" ? "text-gray-500" : 
                "text-green-500"
              )} />
              <span>Status: {label}</span>
            </div>
            <p>{progress}% færdig</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
