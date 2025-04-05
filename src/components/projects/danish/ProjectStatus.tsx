
import React from 'react';
import { cn } from '@/lib/utils';
import { Project } from '@/hooks/projects-types';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PriorityIndicator } from '@/components/ui/PriorityIndicator';
import { ProjectTag } from '@/components/ui/ProjectTag';

interface ProjectStatusProps {
  project: Project;
}

export const ProjectStatus: React.FC<ProjectStatusProps> = ({ project }) => {
  // Function to get priority indicator based on priority
  const getPriorityIndicator = (priority: string) => {
    let priorityValue: "red" | "yellow" | "green" | "grey" = "grey";
    
    if (priority.toLowerCase() === 'høj') priorityValue = "red";
    else if (priority.toLowerCase() === 'mellem') priorityValue = "yellow";
    else if (priority.toLowerCase() === 'lav') priorityValue = "green";
    
    return <PriorityIndicator priority={priorityValue} showLabel={true} />;
  };

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Status</h4>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Fremgang</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress 
                value={project.progress} 
                className="h-2.5 w-full" 
                indicatorClassName={cn(
                  project.status.toLowerCase() === 'problem' && "bg-amber-500",
                  project.status.toLowerCase() === 'udfordring' && "bg-yellow-500",
                  project.status.toLowerCase() === 'aktiv' && "bg-blue-500",
                  project.status.toLowerCase() === 'afsluttet' && "bg-green-500",
                )}
              />
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-full">
              <div className="flex justify-between mb-2 items-center">
                <span className="font-medium">Prioritet</span>
                <div>{getPriorityIndicator(project.priority || "")}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Kategori</span>
                <ProjectTag 
                  label={project.category} 
                  type="category" 
                  className="uppercase"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <ProjectTeam project={project} />
    </div>
  );
};

interface ProjectTeamProps {
  project: Project;
}

export const ProjectTeam: React.FC<ProjectTeamProps> = ({ project }) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Team</h4>
      
      <div className="space-y-3">
        {project.team && project.team.length > 0 ? (
          project.team.map((member, index) => (
            <div key={index} className="flex items-center p-3 rounded-md bg-muted/20 border">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3"
                style={{ backgroundColor: member.color || '#6366F1' }}
              >
                {member.initials}
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role || 'Teammedlem'}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground italic">Ingen teammedlemmer tildelt</p>
        )}
      </div>
    </div>
  );
};
