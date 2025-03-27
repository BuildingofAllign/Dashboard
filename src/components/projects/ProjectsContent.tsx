
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ViewMode } from "@/components/ui/ViewToggle";
import { ProjectCard } from "./ProjectCard";
import { ProjectListItem } from "./ProjectListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Project } from "@/hooks/use-projects";
import { ProjectDetailsCollapsible } from "./ProjectDetailsCollapsible";
import { ProjectProgressIndicator } from "@/components/ui/ProjectProgressIndicator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";

interface ProjectsContentProps {
  viewMode: ViewMode;
  loadingProjects: boolean;
  filteredAndSortedProjects: Project[];
  handlePinWithToast: (projectId: string, isPinned: boolean) => void;
  handleEditProject: (project: any) => void;
  handleDeleteProject: (projectId: string) => void;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
}

export const ProjectsContent: React.FC<ProjectsContentProps> = ({
  viewMode,
  loadingProjects,
  filteredAndSortedProjects,
  handlePinWithToast,
  handleEditProject,
  handleDeleteProject,
  setIsCreateDialogOpen
}) => {
  const handleToastPin = (projectId: string, isPinned: boolean) => {
    handlePinWithToast(projectId, isPinned);
    toast(isPinned ? "Projekt afpinnet" : "Projekt pinnet", {
      description: isPinned 
        ? "Projektet er blevet fjernet fra dine pinnede projekter" 
        : "Projektet er blevet tilføjet til dine pinnede projekter",
      position: "bottom-right",
    });
  };

  if (loadingProjects) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (filteredAndSortedProjects.length === 0) {
    return (
      <EmptyState
        title="Ingen projekter"
        description="Der er ingen projekter at vise på nuværende tidspunkt."
        icon="file"
        actionLabel="Opret nyt projekt"
        onAction={() => setIsCreateDialogOpen(true)}
      />
    );
  }

  if (viewMode === "grid") {
    return (
      <TooltipProvider>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onTogglePin={() => handleToastPin(project.id, project.is_pinned || project.isPinned)}
              onEdit={() => handleEditProject(project)}
              onDelete={
                <DeleteConfirmationDialog 
                  title="Slet projekt"
                  description={`Er du sikker på at du vil slette projektet "${project.name}"?`}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              }
            />
          ))}
        </div>
      </TooltipProvider>
    );
  }

  if (viewMode === "rows") {
    return (
      <TooltipProvider>
        <div className="space-y-4">
          {filteredAndSortedProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow p-4">
              <ProjectDetailsCollapsible project={project} />
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fremgang</h4>
                <ProjectProgressIndicator progress={project.progress} status={project.status} />
              </div>
              <div className="flex justify-between mt-3">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToastPin(project.id, project.is_pinned || project.isPinned)}
                  >
                    {(project.is_pinned || project.isPinned) ? "Afpin" : "Pin"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>Rediger</Button>
                </div>
                <DeleteConfirmationDialog 
                  title="Slet projekt"
                  description={`Er du sikker på at du vil slette projektet "${project.name}"?`}
                  onDelete={() => handleDeleteProject(project.id)}
                  trigger={<Button variant="outline" size="sm">Slet</Button>}
                />
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">Status</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Navn</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Fremgang</TableHead>
            <TableHead>Afvigelser</TableHead>
            <TableHead>Tillæg</TableHead>
            <TableHead>KS</TableHead>
            <TableHead className="text-right">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedProjects.map(project => (
            <ProjectListItem
              key={project.id}
              project={project}
              onTogglePin={() => handleToastPin(project.id, project.is_pinned || project.isPinned)}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};
