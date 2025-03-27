import React from 'react';
import { 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  MessageSquare, 
  Pin, 
  PlusCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityIndicator, Priority } from "@/components/ui/PriorityIndicator";
import { AvatarCircles } from "../ui/avatar-circles";

interface ProjectListItemProps {
  project: any;
  onTogglePin: (id: number) => void;
}

export const ProjectListItem = ({ project, onTogglePin }: ProjectListItemProps) => {
  // Get color for progress based on status and progress
  const getProgressColor = () => {
    if (project.status === "afsluttet") return "bg-gray-400";
    if (project.progress >= 75) return "bg-green-500";
    if (project.progress >= 50) return "bg-blue-500";
    if (project.progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusStyles = () => {
    switch(project.status) {
      case "aktiv":
        return "bg-green-500 text-white";
      case "problem":
        return "bg-red-500 text-white";
      case "udfordring":
        return "bg-yellow-500 text-white";
      case "afsluttet":
        return "bg-gray-400 bg-opacity-70 text-white";
      default:
        return "bg-indigo-700 text-white";
    }
  };

  // Map status to capitalized display text
  const getStatusDisplayText = () => {
    switch(project.status) {
      case "aktiv":
        return "Aktiv";
      case "problem":
        return "Problem";
      case "udfordring":
        return "Udfordring";
      case "afsluttet":
        return "Afsluttet";
      default:
        return project.status;
    }
  };

  return (
    <TableRow className={cn(
      project.isPinned && "border-l-2 border-l-primary"
    )}>
      <TableCell>
        <PriorityIndicator priority={project.priority as Priority} />
      </TableCell>
      
      <TableCell className="font-medium">{project.projectId}</TableCell>
      
      <TableCell>{project.name}</TableCell>
      
      <TableCell>
        <div className={cn("flex items-center px-2 py-1 rounded-full text-xs", getStatusStyles())}>
          <span className="font-medium">{getStatusDisplayText()}</span>
        </div>
      </TableCell>
      
      <TableCell className="max-w-[200px] truncate">
        {project.type}
      </TableCell>
      
      <TableCell>
        {project.team ? (
          <AvatarCircles 
            items={project.team} 
            limit={3} 
            size="xs"
          />
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      
      <TableCell>
        <div className="flex items-center justify-center flex-col w-28">
          <div className="text-base font-bold mb-1">{project.progress}%</div>
          <Progress value={project.progress} className="h-2 w-full" />
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {project.deviations || 0}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline" className="flex items-center gap-1">
          <PlusCircle className="h-3 w-3" />
          {project.additions || 0}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {project.qualityAssurance || 0}%
        </Badge>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <Pin 
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(project.id);
            }}
            className={cn(
              "h-4 w-4 cursor-pointer",
              project.isPinned ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          />
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </TableCell>
    </TableRow>
  );
};
