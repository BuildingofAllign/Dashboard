
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  CalendarDays, 
  Clock, 
  MessageSquare, 
  Pin, 
  ClipboardCheck, 
  AlertTriangle, 
  PlusCircle 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityIndicator, Priority } from "@/components/ui/PriorityIndicator";
import { AvatarCircles } from "../ui/avatar-circles";

export interface Project {
  id: number;
  projectId: string;
  name: string;
  type: string;
  category: "bolig" | "erhverv" | "institution" | "renovering";
  status: "igangværende" | "planlagt" | "afsluttet";
  progress: number;
  team?: {
    initials: string;
    name: string;
    color: string;
    role: string;
  }[];
  additionalTeamMembers?: number;
  deviations: number;
  additions: number;
  qualityAssurance: number;
  communicationTools: string[];
  startDate: string;
  endDate: string;
  completionDate?: string;
  duration?: string;
  messages: {
    high: number;
    medium: number;
    low: number;
  };
  isPinned: boolean;
  priority: Priority;
}

interface ProjectCardProps {
  project: Project;
  onTogglePin: (projectId: number) => void;
}

export const ProjectCard = ({ project, onTogglePin }: ProjectCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md relative overflow-hidden",
        project.isPinned && "border-primary shadow-sm",
      )}
    >
      {project.isPinned && (
        <div className="absolute top-0 right-0">
          <div className="w-12 h-12 bg-primary transform rotate-45 translate-x-6 -translate-y-6" />
          <Pin 
            className="absolute top-1 right-1 h-4 w-4 text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(project.id);
            }}
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              {project.projectId}
            </div>
            <CardTitle className="text-lg font-bold">
              {project.name}
            </CardTitle>
          </div>
          {!project.isPinned && (
            <Pin 
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(project.id);
              }}
              className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer"
            />
          )}
        </div>
        
        <div className="flex items-center space-x-1 mt-1">
          <PriorityIndicator priority={project.priority} size="sm" />
          <div className="text-sm text-muted-foreground">
            {project.type}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Fremgang</span>
            <span className="text-sm">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Status:</span>
            </div>
            <StatusBadge status={project.status} />
          </div>
          
          {project.startDate && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Start:</span>
              </div>
              <span className="text-sm">{project.startDate}</span>
            </div>
          )}
          
          {project.endDate && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Slut:</span>
              </div>
              <span className="text-sm">{project.endDate}</span>
            </div>
          )}
          
          {project.team && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm">Team:</span>
              </div>
              <AvatarCircles 
                items={project.team} 
                limit={3} 
                size="sm"
                className="ml-1"
              />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <div className="w-full">
          <div className="flex justify-between items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {project.deviations || 0}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <PlusCircle className="h-3 w-3" />
              {project.additions || 0}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <ClipboardCheck className="h-3 w-3" />
              {project.qualityAssurance || 0}%
            </Badge>
            
            {project.messages && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {project.messages.high + project.messages.medium + project.messages.low}
              </Badge>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
