import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  ChevronRight, 
  Home, 
  Pin, 
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
  communicationTools?: string[];
  startDate?: string;
  endDate?: string;
  completionDate?: string;
  duration?: string;
  messages?: { high: number; medium: number; low: number };
  isPinned?: boolean;
  priority?: "high" | "medium" | "low";
};

interface ProjectCardProps {
  project: Project;
  onTogglePin?: (projectId: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onTogglePin }) => {
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

  const getPriorityBadge = (priority?: "high" | "medium" | "low") => {
    if (!priority) return null;
    
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Høj prioritet</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium prioritet</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Lav prioritet</Badge>;
      default:
        return null;
    }
  };

  const goToProjectDetails = () => {
    navigate(`/projekter/${project.id}`);
  };

  const goToDeviations = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/afvigelser?project=${project.id}`);
    toast({
      title: "Navigerer til afvigelser",
      description: `Viser afvigelser for ${project.name}`,
    });
  };

  const goToAdditions = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tillagsopgaver?project=${project.id}`);
    toast({
      title: "Navigerer til tillægsopgaver",
      description: `Viser tillægsopgaver for ${project.name}`,
    });
  };

  const goToQualityAssurance = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/kvalitetssikring?project=${project.id}`);
    toast({
      title: "Navigerer til kvalitetssikring",
      description: `Viser kvalitetssikring for ${project.name}`,
    });
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
      className={`overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer ${
        project.status === 'afsluttet' ? 'opacity-75' : ''
      } ${project.isPinned ? 'border-2 border-yellow-400' : ''} ${
        project.priority === 'high' ? 'ring-2 ring-red-400' : ''
      }`}
      onClick={goToProjectDetails}
    >
      <CardHeader className="p-5 pb-3 relative">
        <div className="absolute top-3 right-3 flex space-x-2">
          {onTogglePin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handlePinToggle}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {project.isPinned ? 
                      <Pin className="h-5 w-5 fill-yellow-400 text-yellow-500" /> : 
                      <Pin className="h-5 w-5" />
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
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <span className="text-xs text-gray-500 mr-2">{project.projectId}</span>
            <Badge 
              className={`${getStatusBadgeClass(project.status)} text-xs`}
            >
              {getStatusText(project.status)}
            </Badge>
            {project.priority && (
              <div className="ml-2">
                {getPriorityBadge(project.priority)}
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
          <div className="flex items-center mt-1">
            {renderCategoryIcon(project.category)}
            <p className="text-sm text-gray-600">{project.type}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="flex items-center mb-4">
          <TooltipProvider>
            {project.team?.map((member, index) => (
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

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Fremgang</span>
            <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full cursor-pointer">
                  <Progress 
                    value={project.progress} 
                    className={`h-2 ${getProgressColor(project.progress)}`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-semibold">Projekt fremgang: {project.progress}%</p>
                  <p className="text-xs">Klik for at se detaljeret fremdrift</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
          <button
            onClick={goToDeviations}
            className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
          >
            <span className="font-medium text-gray-800 group-hover:text-indigo-700 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1 text-red-500 group-hover:text-red-600" />
              {project.deviations || 0}
            </span>
            <span className="group-hover:text-indigo-700">Afvigelser</span>
          </button>
          <button
            onClick={goToAdditions}
            className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
          >
            <span className="font-medium text-gray-800 group-hover:text-indigo-700 flex items-center">
              <ClipboardList className="h-3 w-3 mr-1 text-blue-500 group-hover:text-blue-600" />
              {project.additions || 0}
            </span>
            <span className="group-hover:text-indigo-700">Tillæg</span>
          </button>
          <button
            onClick={goToQualityAssurance}
            className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
          >
            <span className="font-medium text-gray-800 group-hover:text-indigo-700 flex items-center">
              <CheckSquare className="h-3 w-3 mr-1 text-green-500 group-hover:text-green-600" />
              {project.qualityAssurance || 0}%
            </span>
            <span className="group-hover:text-indigo-700">KS</span>
          </button>
        </div>

        {project.messages && (
          <div className="flex items-center justify-center mt-4 space-x-2 border-t pt-3">
            <TooltipProvider>
              {project.messages.high > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full bg-red-100 w-6 h-6 flex items-center justify-center text-xs text-red-700 cursor-pointer hover:bg-red-200 transition-colors">
                      {project.messages.high}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.messages.high} højprioritets beskeder</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {project.messages.medium > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full bg-yellow-100 w-6 h-6 flex items-center justify-center text-xs text-yellow-700 cursor-pointer hover:bg-yellow-200 transition-colors">
                      {project.messages.medium}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.messages.medium} medium prioritets beskeder</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {project.messages.low > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full bg-green-100 w-6 h-6 flex items-center justify-center text-xs text-green-700 cursor-pointer hover:bg-green-200 transition-colors">
                      {project.messages.low}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.messages.low} lavprioritet beskeder</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 py-3 bg-gray-50 border-t flex justify-between">
        <div className="text-xs text-gray-500 flex items-center">
          {(project.startDate || project.endDate || project.completionDate) && (
            <Calendar className="h-3 w-3 mr-1" />
          )}
          {project.startDate && <span>Start: {project.startDate}</span>}
          {project.startDate && project.endDate && <span className="mx-1">•</span>}
          {project.endDate && <span>Slut: {project.endDate}</span>}
          {project.completionDate && (
            <>
              {(project.startDate || project.endDate) && <span className="mx-1">•</span>}
              <span>Afsluttet: {project.completionDate}</span>
            </>
          )}
          {project.duration && (
            <div className="ml-2 flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{project.duration}</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost" 
          size="sm" 
          className="text-xs text-gray-700 hover:bg-gray-200 hover:text-indigo-700"
          onClick={goToProjectDetails}
        >
          Se detaljer
        </Button>
      </CardFooter>
    </Card>
  );
};
