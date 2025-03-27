
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityIndicator, Priority } from "@/components/ui/PriorityIndicator";
import { AvatarCircles } from "../ui/avatar-circles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ExternalLink, MoreVertical, Pencil, Pin, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface ProjectCardProps {
  project: any;
  onTogglePin: () => void;
  onEdit?: () => void;
  onDelete?: React.ReactNode;
}

export const ProjectCard = ({ project, onTogglePin, onEdit, onDelete }: ProjectCardProps) => {
  const isPinned = project.is_pinned || project.isPinned;
  const formattedDate = project.updated_at 
    ? format(new Date(project.updated_at), 'dd. MMM yyyy', { locale: da })
    : '';

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      isPinned && "ring-2 ring-primary/10"
    )}>
      <CardHeader className="p-0">
        <div className="relative h-24 w-full bg-gradient-to-r from-primary/80 to-primary">
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <div>
              <PriorityIndicator priority={project.priority as Priority} size="md" />
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                onClick={onTogglePin}
              >
                <Pin className={cn("h-4 w-4", isPinned && "fill-white")} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Projekt Handlinger</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4" />
                    Rediger
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" asChild>
                    {onDelete}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onTogglePin} className="cursor-pointer">
                    <Pin className={cn("mr-2 h-4 w-4", isPinned && "fill-primary")} />
                    {isPinned ? 'Fjern pin' : 'Pin projekt'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{project.project_id}</div>
              <StatusBadge status={project.status} />
            </div>
            <h3 className="font-semibold truncate" title={project.name}>
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate" title={project.type}>
              {project.type}
            </p>
          </div>
          
          {project.team && (
            <AvatarCircles 
              items={project.team} 
              limit={5} 
              size="sm"
            />
          )}
          
          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Fremgang</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 grid grid-cols-3 gap-2 text-xs">
        <Badge variant="outline" className="flex items-center gap-1 justify-center">
          <AlertTriangle className="h-3 w-3" />
          {project.deviations || 0}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1 justify-center">
          <PlusCircle className="h-3 w-3" />
          {project.additions || 0}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1 justify-center">
          <CheckCircle className="h-3 w-3" />
          {project.quality_assurance || 0}%
        </Badge>
      </CardFooter>
    </Card>
  );
};
