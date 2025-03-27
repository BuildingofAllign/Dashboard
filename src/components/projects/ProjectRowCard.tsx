
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Building, 
  CalendarDays, 
  CheckCircle, 
  ChevronRight, 
  MessageSquare,
  Pin,
  PlusCircle
} from "lucide-react";
import { AnimatedCircularProgress } from "@/components/ui/animated-circular-progress";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityIndicator, Priority } from "@/components/ui/PriorityIndicator";
import { AvatarCircles } from "../ui/avatar-circles";

interface TeamMember {
  initials: string;
  name: string;
  color: string;
  role: string;
}

interface Project {
  id: number;
  projectId: string;
  name: string;
  type: string;
  category: "bolig" | "erhverv" | "institution" | "renovering";
  status: "igangværende" | "planlagt" | "afsluttet";
  progress: number;
  team?: TeamMember[];
  additionalTeamMembers?: number;
  deviations: number;
  additions: number;
  qualityAssurance: number;
  communicationTools?: string[];
  startDate?: string;
  endDate?: string;
  messages: { high: number; medium: number; low: number };
  isPinned: boolean;
  priority: Priority;
}

interface ProjectRowCardProps {
  project: Project;
  onTogglePin: (projectId: number) => void;
}

export const ProjectRowCard = ({ project, onTogglePin }: ProjectRowCardProps) => {
  // Get color for progress circle based on status and progress
  const getProgressColor = () => {
    if (project.status === "afsluttet") return "stroke-gray-400";
    if (project.progress >= 75) return "stroke-green-500";
    if (project.progress >= 50) return "stroke-blue-500";
    if (project.progress >= 25) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md overflow-hidden",
        project.isPinned && "border-primary shadow-sm"
      )}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <PriorityIndicator priority={project.priority} />
            
            <div>
              <div className="text-sm text-muted-foreground">
                {project.projectId}
              </div>
              <div className="font-medium">{project.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {project.type}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <StatusBadge status={project.status} />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Fremgang</div>
              <AnimatedCircularProgress 
                value={project.progress} 
                size="xs"
                color={getProgressColor()}
              />
            </div>
            
            {project.team && (
              <div className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">Team</div>
                <AvatarCircles 
                  items={project.team} 
                  limit={3} 
                  size="xs"
                />
              </div>
            )}
            
            <div className="flex space-x-2">
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
        </div>
      </CardContent>
    </Card>
  );
}
