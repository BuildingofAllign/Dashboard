
import React from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Calendar, User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Project } from "@/hooks/use-projects";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface ProjectDetailsCollapsibleProps {
  project: Project;
  className?: string;
}

export const ProjectDetailsCollapsible: React.FC<ProjectDetailsCollapsibleProps> = ({
  project,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "problem": return "destructive";
      case "udfordring": return "bg-yellow-500 text-yellow-950";
      case "afsluttet": return "bg-gray-500 text-white";
      case "aktiv":
      default: return "bg-green-500 text-white";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "red": return "destructive";
      case "yellow": return "bg-yellow-500 text-yellow-950";
      case "grey": return "bg-gray-500 text-white";
      case "green":
      default: return "bg-green-500 text-white";
    }
  };
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("border rounded-md p-2", className)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{project.name}</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <div className="flex gap-2 mt-1">
        <Badge variant="outline" className={cn(getStatusColor(project.status))}>
          {project.status}
        </Badge>
        <Badge variant="outline" className={cn(getPriorityColor(project.priority))}>
          {project.priority === "green" ? "Ingen fejl" : 
           project.priority === "yellow" ? "Midlertidige fejl" :
           project.priority === "red" ? "Kritiske fejl" : "Afsluttet"}
        </Badge>
        <Badge variant="outline">{project.type}</Badge>
      </div>
      
      <CollapsibleContent className="mt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Start: {project.start_date ? formatDate(new Date(project.start_date)) : 'Ikke angivet'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Slutning: {project.end_date ? formatDate(new Date(project.end_date)) : 'Ikke angivet'}</span>
          </div>
          
          {project.description && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <Info className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Beskrivelse</span>
              </div>
              <p className="text-sm text-gray-600 pl-6">{project.description}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex -space-x-2">
              <UserAvatar initials="BL" size="sm" status="online" />
              <UserAvatar initials="JK" size="sm" status="away" />
              <UserAvatar initials="PS" size="sm" status="offline" />
            </div>
            <Button variant="outline" size="sm">Se detaljer</Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
