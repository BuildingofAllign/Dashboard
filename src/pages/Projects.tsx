import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectRowCard } from "@/components/projects/ProjectRowCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { Plus, FileText, AlertTriangle, Check, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProjects } from "@/hooks/use-projects";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ProjectDetailsCollapsible } from "@/components/projects/ProjectDetailsCollapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ProjectProgressIndicator } from "@/components/ui/ProjectProgressIndicator";
import { toast } from "sonner";

const Projects = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  
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

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingProject(null);
  };

  const handlePinWithToast = (projectId: string, isPinned: boolean) => {
    handleTogglePin(projectId, isPinned);
    toast(isPinned ? "Projekt afpinnet" : "Projekt pinnet", {
      description: isPinned 
        ? "Projektet er blevet fjernet fra dine pinnede projekter" 
        : "Projektet er blevet tilføjet til dine pinnede projekter",
      position: "bottom-right",
    });
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
              onTogglePin={() => handlePinWithToast(project.id, project.is_pinned || project.isPinned)}
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
                    onClick={() => handlePinWithToast(project.id, project.is_pinned || project.isPinned)}
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
              onTogglePin={() => handlePinWithToast(project.id, project.is_pinned || project.isPinned)}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header title="Projekter" userInitials="BL" />

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-2">
                <SearchBar
                  placeholder="Søg efter projekt..."
                  onChange={setSearchQuery}
                  value={searchQuery}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setCommandOpen(true)}
                  className="hidden md:flex"
                  id="command-button"
                >
                  <Command className="h-5 w-5" />
                </Button>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Projektoversigt</h4>
                      <div className="text-sm">
                        <p className="flex items-center justify-between">
                          <span>Aktive projekter:</span>
                          <Badge variant="outline" className="bg-green-100">
                            {filteredAndSortedProjects.filter(p => p.status === "aktiv").length}
                          </Badge>
                        </p>
                        <p className="flex items-center justify-between">
                          <span>Problem projekter:</span>
                          <Badge variant="outline" className="bg-red-100">
                            {filteredAndSortedProjects.filter(p => p.status === "problem").length}
                          </Badge>
                        </p>
                        <p className="flex items-center justify-between">
                          <span>Udfordrende projekter:</span>
                          <Badge variant="outline" className="bg-yellow-100">
                            {filteredAndSortedProjects.filter(p => p.status === "udfordring").length}
                          </Badge>
                        </p>
                        <p className="flex items-center justify-between">
                          <span>Afsluttede projekter:</span>
                          <Badge variant="outline" className="bg-gray-100">
                            {filteredAndSortedProjects.filter(p => p.status === "afsluttet").length}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
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
                  id="create-project-button"
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
        
        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
        />
      </div>
    </SidebarProvider>
  );
};

export default Projects;
