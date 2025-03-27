
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectRowCard } from "@/components/projects/ProjectRowCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProjects } from "@/hooks/use-projects";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";

const Projects = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
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

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingProject(null);
  };

  const renderProjectContent = () => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onTogglePin={() => handleTogglePin(project.id, project.is_pinned || project.isPinned)}
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
      );
    }

    if (viewMode === "rows") {
      return (
        <div className="space-y-2">
          {filteredAndSortedProjects.map(project => (
            <ProjectRowCard
              key={project.id}
              project={project}
              onTogglePin={() => handleTogglePin(project.id, project.is_pinned || project.isPinned)}
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
      );
    }

    return (
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
              onTogglePin={() => handleTogglePin(project.id, project.is_pinned || project.isPinned)}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title="Projekter" userInitials="BL" />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar
              placeholder="Søg efter projekt..."
              onChange={setSearchQuery}
              value={searchQuery}
            />
            <div className="flex flex-wrap space-x-2 mt-4 md:mt-0 items-center">
              <FilterSelect 
                onChange={(e) => setTypeFilter(e.target.value)}
                value={typeFilter}
                className="min-w-[150px]"
              >
                <option value="all">Alle typer</option>
                <option value="nybyggeri">Nybyggeri</option>
                <option value="renovering">Renovering</option>
                <option value="tilbygning">Tilbygning</option>
              </FilterSelect>
              
              <FilterSelect
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
                className="min-w-[150px]"
              >
                <option value="all">Alle status</option>
                <option value="aktiv">Aktiv</option>
                <option value="problem">Problem</option>
                <option value="udfordring">Udfordring</option>
                <option value="afsluttet">Afsluttet</option>
              </FilterSelect>
              
              <FilterSelect
                onChange={(e) => setPriorityFilter(e.target.value)}
                value={priorityFilter}
                className="min-w-[180px]"
              >
                <option value="all">Alle prioriteter</option>
                <option value="red">Kritiske fejl</option>
                <option value="yellow">Midlertidige fejl</option>
                <option value="green">Fungerer som planlagt</option>
                <option value="grey">Afsluttede</option>
              </FilterSelect>
              
              <ViewToggle 
                currentView={viewMode}
                onChange={setViewMode}
              />
              
              <Button 
                className="flex items-center"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-5 w-5 mr-1" />
                Nyt Projekt
              </Button>
            </div>
          </div>

          <TooltipProvider>
            {renderProjectContent()}
          </TooltipProvider>
        </div>
      </main>

      <ProjectFormDialog
        open={isCreateDialogOpen}
        onOpenChange={handleCloseDialog}
        mode={editingProject ? "edit" : "create"}
        initialData={editingProject}
      />
    </div>
  );
};

export default Projects;
