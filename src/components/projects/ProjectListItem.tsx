
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
  PlusCircle,
  Play
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedCircularProgress } from "@/components/ui/animated-circular-progress";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityIndicator, Priority } from "@/components/ui/PriorityIndicator";
import { AvatarCircles } from "../ui/avatar-circles";

interface ProjectListItemProps {
  project: any;
  onTogglePin: (id: number) => void;
}

export const ProjectListItem = ({ project, onTogglePin }: ProjectListItemProps) => {
  // Get color for progress circle based on status and progress
  const getProgressColor = () => {
    if (project.status === "afsluttet") return "stroke-gray-400";
    if (project.progress >= 75) return "stroke-green-500";
    if (project.progress >= 50) return "stroke-blue-500";
    if (project.progress >= 25) return "stroke-yellow-500";
    return "stroke-red-500";
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
        <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
          <Play className="h-3 w-3 mr-1 fill-blue-700" />
          <span className="font-medium">{project.status}</span>
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
        <div className="flex items-center justify-center">
          <div className="text-base font-bold">{project.progress}%</div>
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
