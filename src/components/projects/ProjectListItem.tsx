
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle,
  ClipboardList,
  CheckSquare,
  Pin, 
  PinOff,
  Home, 
  Building, 
  Building2, 
  ConstructionIcon, 
  Factory,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";

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
  priority?: "red" | "yellow" | "green" | "grey";
};

interface ProjectListItemProps {
  project: Project;
  onTogglePin?: (projectId: number) => void;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, onTogglePin }) => {
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
        return <Home className="h-4 w-4" />;
      case "erhverv":
        return <Building className="h-4 w-4" />;
      case "institution":
        return <Building2 className="h-4 w-4" />;
      case "renovering":
        return <ConstructionIcon className="h-4 w-4" />;
      default:
        return <Factory className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "red":
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
            <span className="text-red-600 font-medium">Kritisk fejl</span>
          </div>
        );
      case "yellow":
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />
            <span className="text-yellow-600 font-medium">Midlertidig fejl</span>
          </div>
        );
      case "green":
        return (
          <div className="flex items-center">
            <CheckSquare className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">OK</span>
          </div>
        );
      case "grey":
        return (
          <div className="flex items-center">
            <CheckSquare className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-gray-600 font-medium">Afsluttet</span>
          </div>
        );
      default:
        return null;
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

  // Add priority-based border styling
  const getPriorityBorderClass = (priority: string) => {
    switch (priority) {
      case "red":
        return "border-l-4 border-l-red-500";
      case "yellow":
        return "border-l-4 border-l-yellow-500";
      case "green":
        return "border-l-4 border-l-green-500";
      case "grey":
        return "border-l-4 border-l-gray-300";
      default:
        return "";
    }
  };

  return (
    <TableRow 
      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
        project.status === 'afsluttet' ? 'opacity-75' : ''
      } ${project.isPinned ? 'border-l-4 border-l-blue-600 pl-0' : ''} 
      ${!project.isPinned ? getPriorityBorderClass(project.priority) : ''}`}
      onClick={goToProjectDetails}
    >
      <TableCell className="py-3 w-40">
        {getPriorityBadge(project.priority)}
      </TableCell>
      
      <TableCell className="py-3 w-24">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">{project.projectId}</span>
        </div>
      </TableCell>
      
      <TableCell className="py-3 w-64">
        <div className="flex items-center">
          <h3 className="text-sm font-semibold text-gray-800">{project.name}</h3>
        </div>
      </TableCell>
      
      <TableCell className="py-3 w-20">
        <Badge className={`${getStatusBadgeClass(project.status)} text-xs`}>
          {getStatusText(project.status)}
        </Badge>
      </TableCell>
      
      <TableCell className="py-3 w-36">
        <div className="flex items-center">
          {renderCategoryIcon(project.category)}
          <span className="text-sm text-gray-600 ml-1">{project.type}</span>
        </div>
      </TableCell>
      
      <TableCell className="py-3 w-36">
        <div className="flex items-center">
          {project.team?.slice(0, 2).map((member, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`w-7 h-7 rounded-full ${member.color} flex items-center justify-center text-white text-xs -ml-1 first:ml-0 border-2 border-white`}>
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
            </TooltipProvider>
          ))}
          {(project.team && project.team.length > 2 || project.additionalTeamMembers) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs -ml-1 border-2 border-white">
                    +{(project.team?.length || 0) - 2 + (project.additionalTeamMembers || 0)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{(project.team?.length || 0) - 2 + (project.additionalTeamMembers || 0)} flere medarbejdere</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      
      <TableCell className="py-3 w-32">
        <div className="flex flex-col">
          <div className="flex justify-between mb-1">
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
      </TableCell>
      
      <TableCell className="py-3 w-24">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm">{project.deviations || 0}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Afvigelser</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      <TableCell className="py-3 w-24">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <ClipboardList className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm">{project.additions || 0}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tillægsopgaver</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      <TableCell className="py-3 w-24">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm">{project.qualityAssurance || 0}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Kvalitetssikring</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      <TableCell className="py-3 text-right w-10">
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
      </TableCell>
    </TableRow>
  );
};
