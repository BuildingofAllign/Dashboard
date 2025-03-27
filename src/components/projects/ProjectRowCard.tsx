
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  ChevronRight, 
  Home, 
  Pin, 
  PinOff, 
  ConstructionIcon, 
  Building, 
  Factory,
  AlertTriangle,
  ClipboardList,
  CheckSquare,
  Calendar,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TeamMember = {
  initials: string;
  name: string;
  color: string;
  role?: string;
};

type Project = {
  id: number;
  projectId: string;
  name: string;
  type: string;
  category: "bolig" | "erhverv" | "institution" | "renovering" | "andet";
  status: "igangværende" | "planlagt" | "afsluttet";
  progress: number;
  team?: TeamMember[];
  additionalTeamMembers?: number;
  deviations?: number;
  additions?: number;
  qualityAssurance?: number;
  startDate?: string;
  endDate?: string;
  completionDate?: string;
  duration?: string;
  messages?: { high: number; medium: number; low: number };
  isPinned?: boolean;
  priority?: "high" | "medium" | "low";
};

interface ProjectRowCardProps {
  project: Project;
  onTogglePin?: (projectId: number) => void;
}

export const ProjectRowCard: React.FC<ProjectRowCardProps> = ({ project, onTogglePin }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "igangværende":
        return "bg-green-100 text-green-800";
      case "planlagt":
        return "bg-yellow-100 text-yellow-800";
      case "afsluttet":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-600";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "igangværende":
        return "Igangværende";
      case "planlagt":
        return "Planlagt";
      case "afsluttet":
        return "Afsluttet";
      default:
        return status;
    }
  };

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case "bolig":
        return <Home className="h-4 w-4 mr-1" />;
      case "erhverv":
        return <Building className="h-4 w-4 mr-1" />;
      case "institution":
        return <Building2 className="h-4 w-4 mr-1" />;
      case "renovering":
        return <ConstructionIcon className="h-4 w-4 mr-1" />;
      default:
        return <Factory className="h-4 w-4 mr-1" />;
    }
  };

  const goToProjectDetails = () => {
    navigate(`/projekter/${project.id}`);
  };

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePin) {
      onTogglePin(project.id);
      toast({
        title: project.isPinned ? "Projekt fjernet fra favoritter" : "Projekt tilføjet til favoritter",
        description: project.isPinned 
          ? `${project.name} er ikke længere fastgjort` 
          : `${project.name} er nu fastgjort øverst`,
      });
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer mb-2 ${
        project.status === 'afsluttet' ? 'opacity-75' : ''
      } ${project.isPinned ? 'border-l-4 border-l-blue-600' : ''}`}
      onClick={goToProjectDetails}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">{project.projectId}</span>
              <Badge className={`${getStatusBadgeClass(project.status)} text-xs`}>
                {getStatusText(project.status)}
              </Badge>
              <h3 className="text-lg font-semibold text-gray-800 ml-3">{project.name}</h3>
              <div className="flex items-center ml-3">
                {renderCategoryIcon(project.category)}
                <p className="text-sm text-gray-600">{project.type}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Progress section */}
            <div className="w-40">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Fremgang</span>
                <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Progress 
                      value={project.progress} 
                      className={`h-2 ${getProgressColor(project.progress)}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Projekt fremgang: {project.progress}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Team members section */}
            <div className="flex items-center">
              <TooltipProvider>
                {project.team?.slice(0, 3).map((member, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs -ml-1 first:ml-0 border-2 border-white cursor-pointer`}>
                        {member.initials}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-semibold">{member.name}</p>
                        {member.role && <p className="text-xs text-gray-500">{member.role}</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {project.additionalTeamMembers && project.additionalTeamMembers > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs -ml-1 border-2 border-white cursor-pointer">
                        +{project.additionalTeamMembers}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{project.additionalTeamMembers} flere medarbejdere</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
            
            {/* Metrics section */}
            <div className="flex space-x-3 text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-gray-700">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      <span>{project.deviations || 0}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Afvigelser</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-gray-700">
                      <ClipboardList className="h-4 w-4 text-blue-500 mr-1" />
                      <span>{project.additions || 0}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tillægsopgaver</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-gray-700">
                      <CheckSquare className="h-4 w-4 text-green-500 mr-1" />
                      <span>{project.qualityAssurance || 0}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Kvalitetssikring</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Dates section */}
            <div className="text-xs text-gray-500 flex items-center">
              {(project.startDate || project.endDate) && (
                <>
                  <Calendar className="h-3 w-3 mr-1" />
                  {project.startDate && <span>{project.startDate}</span>}
                  {project.startDate && project.endDate && <span className="mx-1">-</span>}
                  {project.endDate && <span>{project.endDate}</span>}
                </>
              )}
            </div>
            
            {/* Actions section */}
            <div className="flex items-center space-x-2">
              {onTogglePin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={handlePinToggle}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {project.isPinned ? 
                          <Pin className="h-5 w-5 fill-blue-600 text-blue-600" /> : 
                          <PinOff className="h-5 w-5" />
                        }
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {project.isPinned ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
