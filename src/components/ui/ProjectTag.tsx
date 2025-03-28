
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProjectTagProps {
  label: string;
  type?: "type" | "status" | "priority" | "category";
  showTooltip?: boolean;
  tooltipText?: string;
  className?: string;
}

export const ProjectTag: React.FC<ProjectTagProps> = ({
  label,
  type = "type",
  showTooltip = false,
  tooltipText,
  className,
}) => {
  const typeStyles = {
    type: {
      nybyggeri: "bg-blue-50 text-blue-700 border-blue-200",
      renovering: "bg-purple-50 text-purple-700 border-purple-200",
      tilbygning: "bg-green-50 text-green-700 border-green-200",
      default: "bg-gray-50 text-gray-700 border-gray-200",
    },
    status: {
      aktiv: "bg-blue-50 text-blue-700 border-blue-200",
      afsluttet: "bg-green-50 text-green-700 border-green-200",
      "ikke-startet": "bg-gray-50 text-gray-700 border-gray-200",
      standset: "bg-red-50 text-red-700 border-red-200",
      default: "bg-gray-50 text-gray-700 border-gray-200",
    },
    priority: {
      red: "bg-red-50 text-red-700 border-red-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      green: "bg-green-50 text-green-700 border-green-200",
      grey: "bg-gray-50 text-gray-700 border-gray-200",
      default: "bg-gray-50 text-gray-700 border-gray-200",
    },
    category: {
      bolig: "bg-indigo-50 text-indigo-700 border-indigo-200",
      erhverv: "bg-orange-50 text-orange-700 border-orange-200",
      offentlig: "bg-teal-50 text-teal-700 border-teal-200",
      default: "bg-gray-50 text-gray-700 border-gray-200",
    },
  };

  const lowerLabel = label.toLowerCase();
  const style = typeStyles[type][lowerLabel] || typeStyles[type].default;

  const tag = (
    <Badge 
      variant="outline" 
      className={cn(
        "uppercase text-xs font-medium px-2 py-0.5", 
        style,
        className
      )}
    >
      {label}
    </Badge>
  );

  if (!showTooltip) return tag;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {tag}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText || label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
