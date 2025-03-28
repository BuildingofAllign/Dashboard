
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useProjects } from "@/hooks/use-projects";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectsContent } from "./ProjectsContent";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { useCommandPalette } from "@/components/ui/CommandPalette";
import { ViewMode } from "@/components/ui/ViewToggle";
import { EmptyState } from "@/components/ui/EmptyState";

const ProjectsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { setOpen: setCommandOpen } = useCommandPalette();
  const navigate = useNavigate();
  
  const {
    filteredAndSortedProjects,
    loadingProjects,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    fetchProjects,
    handleTogglePin,
    handleDeleteProject
  } = useProjects();

  useEffect(() => {
    console.log("ProjectsPage mounted, fetching projects...");
    fetchProjects();
  }, [fetchProjects]);

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingProject(null);
  };

  const handlePinWithToast = (projectId: string, isPinned: boolean) => {
    handleTogglePin(projectId, isPinned);
  };

  return (
    <div className="flex-1">
      <Header title="Projekter" userInitials="BL" />

      <div className="p-6">
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
          setCommandOpen={setCommandOpen}
        />

        <ProjectsContent 
          viewMode={viewMode}
          loadingProjects={loadingProjects}
          filteredAndSortedProjects={filteredAndSortedProjects}
          handlePinWithToast={handlePinWithToast}
          handleEditProject={handleEditProject}
          handleDeleteProject={handleDeleteProject}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        />
      </div>

      <ProjectFormDialog
        open={isCreateDialogOpen}
        onOpenChange={handleCloseDialog}
        mode={editingProject ? "edit" : "create"}
        initialData={editingProject}
      />
    </div>
  );
};

export default ProjectsPage;
