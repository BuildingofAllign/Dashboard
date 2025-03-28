
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Project } from "@/hooks/projects-types";
import { ProjectProgressIndicator } from "./ProjectProgressIndicator";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { CalendarDays, Clock, Users, ClipboardList } from "lucide-react";

interface ProjectHoverCardProps {
  project: Project;
  children: React.ReactNode;
}

export const ProjectHoverCard: React.FC<ProjectHoverCardProps> = ({
  project,
  children,
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold">{project.name}</h4>
            <p className="text-sm text-muted-foreground">#{project.project_id}</p>
          </div>

          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>Status: {project.status}</span>
            </div>

            {project.start_date && (
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                <span>Startdato: {format(new Date(project.start_date), 'd. MMM yyyy', { locale: da })}</span>
              </div>
            )}

            {project.end_date && (
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                <span>Deadline: {format(new Date(project.end_date), 'd. MMM yyyy', { locale: da })}</span>
              </div>
            )}

            {project.team && project.team.length > 0 ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                <span>Team: {project.team.map(t => t.name).join(', ')}</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-muted-foreground">
                <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                <span>Ingen team</span>
              </div>
            )}
          </div>

          <div className="pt-1">
            <div className="text-xs text-muted-foreground mb-1">Fremgang</div>
            <ProjectProgressIndicator
              progress={project.progress}
              status={project.status}
              size="sm"
              showIcon={false}
            />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
