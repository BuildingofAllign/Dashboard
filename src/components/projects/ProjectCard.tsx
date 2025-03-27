
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  status: "aktiv" | "problem" | "udfordring" | "afsluttet";
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
  communicationTools?: string[];
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
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md relative overflow-hidden",
        project.isPinned && "border-primary shadow-sm",
      )}
    >
      {project.isPinned && (
        <div className="absolute top-0 right-0">
          <div className="w-12 h-12 bg-indigo-700 transform rotate-45 translate-x-6 -translate-y-6" />
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
        <div className="flex justify-between items-center mb-1">
          <div className={cn("flex items-center px-3 py-1 rounded-full", getStatusStyles())}>
            <span className="text-sm font-medium">{getStatusDisplayText()}</span>
          </div>
          <div className="text-sm font-medium">{project.progress}%</div>
        </div>
        
        <div className="mb-4">
          <Progress value={project.progress} className="h-2 bg-slate-200 [&>div]:bg-indigo-700" />
        </div>
        
        <div className="grid grid-cols-1 gap-3">
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
