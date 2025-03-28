import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectProgressIndicator } from "@/components/ui/ProjectProgressIndicator";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityIndicator } from "@/components/ui/PriorityIndicator";
import { cn } from "@/lib/utils";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { CalendarDays, ClipboardList } from "lucide-react";
import { Project } from "@/hooks/projects-types";
import { ProjectTag } from "@/components/ui/ProjectTag";

interface ProjectSummaryCardProps {
  project: Project;
  className?: string;
}

export const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({ project, className }) => {
  const priorityValue = (project.priority || "green") as "red" | "yellow" | "green" | "grey";
  const statusValue = (project.status || "active") as any;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md border-l-4 hover:translate-y-[-2px] duration-200",
      project.priority === "red" && "border-l-red-500",
      project.priority === "yellow" && "border-l-yellow-500",
      project.priority === "green" && "border-l-green-500",
      project.priority === "grey" && "border-l-gray-400",
      className
    )}>
      <CardHeader className="p-4 pb-0 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PriorityIndicator priority={priorityValue} size="sm" />
              <StatusBadge status={statusValue} />
            </div>
            <h3 className="font-medium text-lg leading-tight">{project.name}</h3>
          </div>
          
          <ProjectTag 
            label={project.type} 
            type="type" 
            showTooltip={true} 
            tooltipText={`Projekttype: ${project.type}`}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-3 space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium text-foreground">#{project.project_id}</span>
          {project.created_at && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{format(new Date(project.created_at), 'd. MMM yyyy', { locale: da })}</span>
            </div>
          )}
        </div>
        
        {project.description && (
          <div className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </div>
        )}
        
        <ProjectProgressIndicator 
          progress={project.progress} 
          status={project.status} 
          size="md"
          showIcon={true}
        />
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {project.team && project.team.length > 0 ? (
            <AvatarCircles items={project.team} limit={3} size="sm" />
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <ClipboardList className="h-3.5 w-3.5 mr-1" />
              <span>Ingen team</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {project.end_date && (
            <Badge variant="outline" className="text-xs bg-background">
              Deadline: {format(new Date(project.end_date), 'd. MMM', { locale: da })}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
