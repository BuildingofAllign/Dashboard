import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect, FilterButton } from "@/components/ui/FilterButton";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectRowCard } from "@/components/projects/ProjectRowCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { Plus, Pin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useProjects } from "@/hooks/use-projects";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const Projects = () => {
  const {
    projects,
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
    refreshProjects,
    handleTogglePin
  } = useProjects();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const renderProjectsByStatus = (statusProjects, title) => {
    if (statusProjects.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statusProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
              />
            ))}
          </div>
        )}
        {viewMode === "rows" && (
          <div className="flex flex-col space-y-2">
            {statusProjects.map(project => (
              <ProjectRowCard 
                key={project.id} 
                project={project} 
                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
              />
            ))}
          </div>
        )}
        {viewMode === "list" && (
          null
        )}
      </div>
    );
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "red": return "Kritiske fejl";
      case "yellow": return "Midlertidige fejl";
      case "green": return "Fungerer som planlagt";
      case "grey": return "Afsluttede projekter";
      default: return "Alle prioriteter";
    }
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

          {loadingProjects ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <TooltipProvider>
              {viewMode === "list" ? (
                <div className="space-y-8">
                  {filteredAndSortedProjects.some(p => p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <Pin className="h-5 w-5 text-yellow-500 mr-2" />
                        Fastgjorte projekter
                      </h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Prioritet</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Navn</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Fremgang</TableHead>
                            <TableHead>Afvigelser</TableHead>
                            <TableHead>Tillæg</TableHead>
                            <TableHead>KS</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSortedProjects
                            .filter(p => p.is_pinned)
                            .map(project => (
                              <ProjectListItem 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {filteredAndSortedProjects.some(p => p.priority === "red" && !p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        Kritiske fejl
                      </h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Prioritet</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Navn</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Fremgang</TableHead>
                            <TableHead>Afvigelser</TableHead>
                            <TableHead>Tillæg</TableHead>
                            <TableHead>KS</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "red" && !p.is_pinned)
                            .map(project => (
                              <ProjectListItem 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {filteredAndSortedProjects.some(p => p.priority === "yellow" && !p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        Midlertidige fejl
                      </h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Prioritet</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Navn</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Fremgang</TableHead>
                            <TableHead>Afvigelser</TableHead>
                            <TableHead>Tillæg</TableHead>
                            <TableHead>KS</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "yellow" && !p.is_pinned)
                            .map(project => (
                              <ProjectListItem 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {filteredAndSortedProjects.some(p => p.priority === "green" && !p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
                        Fungerer som planlagt
                      </h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Prioritet</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Navn</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Fremgang</TableHead>
                            <TableHead>Afvigelser</TableHead>
                            <TableHead>Tillæg</TableHead>
                            <TableHead>KS</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "green" && !p.is_pinned)
                            .map(project => (
                              <ProjectListItem 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {filteredAndSortedProjects.some(p => p.priority === "grey" && !p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-gray-500 mr-2" />
                        Afsluttede projekter
                      </h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Prioritet</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Navn</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Fremgang</TableHead>
                            <TableHead>Afvigelser</TableHead>
                            <TableHead>Tillæg</TableHead>
                            <TableHead>KS</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "grey" && !p.is_pinned)
                            .map(project => (
                              <ProjectListItem 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredAndSortedProjects.some(p => p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <Pin className="h-5 w-5 text-yellow-500 mr-2" />
                        Fastgjorte projekter
                      </h2>
                      {viewMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredAndSortedProjects
                            .filter(p => p.is_pinned)
                            .map(project => (
                              <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                      {viewMode === "rows" && (
                        <div className="flex flex-col space-y-2">
                          {filteredAndSortedProjects
                            .filter(p => p.is_pinned)
                            .map(project => (
                              <ProjectRowCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {filteredAndSortedProjects.some(p => p.priority === "red" && !p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        Kritiske fejl
                      </h2>
                      {viewMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "red" && !p.is_pinned)
                            .map(project => (
                              <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                      {viewMode === "rows" && (
                        <div className="flex flex-col space-y-2">
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "red" && !p.is_pinned)
                            .map(project => (
                              <ProjectRowCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {filteredAndSortedProjects.some(p => p.priority === "yellow" && !p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        Midlertidige fejl
                      </h2>
                      {viewMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "yellow" && !p.is_pinned)
                            .map(project => (
                              <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                      {viewMode === "rows" && (
                        <div className="flex flex-col space-y-2">
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "yellow" && !p.is_pinned)
                            .map(project => (
                              <ProjectRowCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {filteredAndSortedProjects.some(p => p.priority === "green" && !p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
                        Fungerer som planlagt
                      </h2>
                      {viewMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "green" && !p.is_pinned)
                            .map(project => (
                              <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                      {viewMode === "rows" && (
                        <div className="flex flex-col space-y-2">
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "green" && !p.is_pinned)
                            .map(project => (
                              <ProjectRowCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {filteredAndSortedProjects.some(p => p.priority === "grey" && !p.is_pinned) && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-gray-500 mr-2" />
                        Afsluttede projekter
                      </h2>
                      {viewMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "grey" && !p.is_pinned)
                            .map(project => (
                              <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                      {viewMode === "rows" && (
                        <div className="flex flex-col space-y-2">
                          {filteredAndSortedProjects
                            .filter(p => p.priority === "grey" && !p.is_pinned)
                            .map(project => (
                              <ProjectRowCard 
                                key={project.id} 
                                project={project} 
                                onTogglePin={() => handleTogglePin(project.id, project.is_pinned)}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TooltipProvider>
          )}
        </div>
      </main>

      <ProjectFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />
    </div>
  );
};

export default Projects;
