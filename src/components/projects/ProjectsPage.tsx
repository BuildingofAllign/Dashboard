
import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useCommandPalette } from "@/components/ui/CommandPalette";
import { useProjects } from "@/hooks/use-projects";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectsContent } from "./ProjectsContent";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ViewMode } from "@/components/ui/ViewToggle";
import { ProjectFormValues } from "./ProjectForm";

const ProjectsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { open: commandOpen, setOpen: setCommandOpen } = useCommandPalette();
  
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
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
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
        </main>

        <ProjectFormDialog
          open={isCreateDialogOpen}
          onOpenChange={handleCloseDialog}
          mode={editingProject ? "edit" : "create"}
          initialData={editingProject}
        />
        
        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
        />
      </div>
    </SidebarProvider>
  );
};

export default ProjectsPage;
