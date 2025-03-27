
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ProjectProgressIndicatorProps {
  progress: number;
  status: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export const ProjectProgressIndicator: React.FC<ProjectProgressIndicatorProps> = ({
  progress,
  status,
  size = "md",
  showTooltip = true,
  className
}) => {
  // Get appropriate color based on status
  const getColorClass = () => {
    switch (status.toLowerCase()) {
      case "problem":
        return "bg-red-500";
      case "udfordring":
        return "bg-yellow-500";
      case "afsluttet":
        return "bg-gray-500";
      case "aktiv":
      default:
        return "bg-green-500";
    }
  };
  
  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }[size];
  
  const progressBar = (
    <div className={cn("w-full", className)}>
      <Progress 
        value={progress} 
        className={cn("rounded-full bg-gray-200", heightClass)} 
        indicatorClassName={cn("rounded-full", getColorClass())}
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
          <p>{progress}% færdig</p>
          <p>Status: {status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
