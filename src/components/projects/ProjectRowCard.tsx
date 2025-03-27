
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityIndicator, Priority } from "@/components/ui/PriorityIndicator";
import { AvatarCircles } from "../ui/avatar-circles";
import { AlertTriangle, CheckCircle, ChevronRight, Pencil, Pin, PlusCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ProjectRowCardProps {
  project: any;
  onTogglePin: () => void;
  onEdit?: () => void;
  onDelete?: React.ReactNode;
}

export const ProjectRowCard = ({ project, onTogglePin, onEdit, onDelete }: ProjectRowCardProps) => {
  const isPinned = project.is_pinned || project.isPinned;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      isPinned && "border-l-4 border-l-primary"
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3 md:w-1/3">
            <PriorityIndicator priority={project.priority as Priority} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <div className="flex text-sm text-muted-foreground gap-2">
                <span>{project.project_id}</span>
                <span>•</span>
                <span className="truncate">{project.type}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 md:flex-1">
            <div className="w-full md:w-auto">
              {project.team ? (
                <AvatarCircles 
                  items={project.team} 
                  limit={4} 
                  size="sm"
                />
              ) : (
                <span className="text-muted-foreground text-sm">Ingen team</span>
              )}
            </div>
            
            <div className="w-full md:w-48">
              <div className="flex justify-between text-sm mb-1">
                <span>Fremgang</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {project.deviations || 0}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <PlusCircle className="h-3 w-3" />
                {project.additions || 0}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {project.quality_assurance || 0}%
              </Badge>
            </div>
            
            <div className="flex items-center space-x-1 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={onTogglePin}
              >
                <Pin className={cn("h-4 w-4", isPinned && "fill-primary text-primary")} />
              </Button>
              
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              
              {onDelete}
              
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
