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
import { PriorityIndicator } from "@/components/ui/PriorityIndicator";
import { AvatarCircles } from "../ui/avatar-circles";

interface ProjectListItemProps {
  project: any;
  onTogglePin: (id: number) => void;
}

export const ProjectListItem = ({ project, onTogglePin }: ProjectListItemProps) => {
  return (
    <TableRow className={cn(
      project.isPinned && "border-l-2 border-l-primary"
    )}>
      <TableCell>
        <PriorityIndicator priority={project.priority} size="sm" />
      </TableCell>
      
      <TableCell className="font-medium">{project.projectId}</TableCell>
      
      <TableCell>{project.name}</TableCell>
      
      <TableCell>
        <StatusBadge status={project.status} />
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
        <div className="flex items-center space-x-2 w-32">
          <Progress value={project.progress} className="h-2 flex-1" />
          <span className="text-xs">{project.progress}%</span>
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
