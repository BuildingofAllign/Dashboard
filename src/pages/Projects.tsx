
import React, { useState, useEffect } from "react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectsHeader } from "@/components/projects/ProjectsHeader";
import { ProjectsContent } from "@/components/projects/ProjectsContent";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ViewMode } from "@/components/ui/ViewToggle";
import { toast } from "sonner";
import { ProjectSummaryCard } from "@/components/ui/ProjectSummaryCard";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/badge";

const Projects = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(
    localStorage.getItem('projectViewMode') as ViewMode || 'grid'
  );
  
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredAndSortedProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleTogglePin,
    loadingProjects
  } = useProjects();
  
  useEffect(() => {
    localStorage.setItem('projectViewMode', viewMode);
  }, [viewMode]);
  
  const handleEditProject = (project: any) => {
    // Implement editing functionality
    toast.info(`Redigerer projekt: ${project.name}`);
  };
  
  const handlePinWithToast = (projectId: string, isPinned: boolean) => {
    handleTogglePin(projectId, isPinned);
    toast.success(isPinned ? "Projekt fjernet fra favoritter" : "Projekt tilføjet til favoritter", {
      description: isPinned 
        ? "Projektet vil ikke længere være fastgjort til toppen" 
        : "Projektet vil nu være fastgjort til toppen af listen",
      duration: 3000,
    });
  };
  
  // Group projects by type (using Gestalt principle of similarity)
  const pinnedProjects = filteredAndSortedProjects.filter(p => p.is_pinned || p.isPinned);
  const projectsByType = filteredAndSortedProjects.reduce((acc, project) => {
    // Skip pinned projects as they are shown separately
    if (project.is_pinned || project.isPinned) return acc;
    
    const type = project.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(project);
    return acc;
  }, {} as Record<string, typeof filteredAndSortedProjects>);
  
  // Sort types for consistent display (Gestalt principle of continuity)
  const sortedTypes = Object.keys(projectsByType).sort();

  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <ProjectsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        filteredAndSortedProjects={filteredAndSortedProjects}
        setCommandOpen={setIsCommandOpen}
      />
      
      {viewMode !== "list" && pinnedProjects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Fastgjorte projekter</h2>
            <Badge variant="secondary" className="rounded-full">
              {pinnedProjects.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedProjects.map(project => (
              <ProjectSummaryCard
                key={`pinned-${project.id}`}
                project={project}
                className="border-primary/30 shadow-sm"
              />
            ))}
          </div>
          
          <Separator />
        </div>
      )}
      
      {viewMode === "list" ? (
        <ProjectsContent 
          viewMode={viewMode}
          loadingProjects={loadingProjects}
          filteredAndSortedProjects={filteredAndSortedProjects}
          handlePinWithToast={handlePinWithToast}
          handleEditProject={handleEditProject}
          handleDeleteProject={handleDeleteProject}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        />
      ) : (
        loadingProjects ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-pulse">Indlæser projekter...</div>
          </div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <EmptyState
            title="Ingen projekter fundet"
            description="Prøv at justere dine filtre eller opret et nyt projekt."
            icon="file"
            actionLabel="Opret nyt projekt"
            onAction={() => setIsCreateDialogOpen(true)}
          />
        ) : (
          <div className="space-y-8">
            {sortedTypes.map(type => (
              <div key={type} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium capitalize">{type}</h2>
                  <Badge variant="outline" className="rounded-full">
                    {projectsByType[type].length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {projectsByType[type].map(project => (
                    <ProjectSummaryCard
                      key={project.id}
                      project={project}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
      
      <ProjectFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />
      
      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
      />
    </div>
  );
};

export default Projects;
