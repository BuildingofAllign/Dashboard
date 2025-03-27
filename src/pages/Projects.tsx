
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect, FilterButton } from "@/components/ui/FilterButton";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectRowCard } from "@/components/projects/ProjectRowCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { AddProjectCard } from "@/components/projects/AddProjectCard";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { Plus, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/ui/StatusBadge";

const initialProjects = [
  {
    id: 1,
    projectId: "P-103",
    name: "Projekt Skovvej 12",
    type: "Nybyggeri - Villa",
    category: "bolig" as const,
    status: "igangværende" as const,
    progress: 75,
    team: [
      { initials: "JP", name: "Jens Paulsen", color: "bg-indigo-600", role: "Tømrer" },
      { initials: "BS", name: "Boktogan Saruhan", color: "bg-red-500", role: "Elektriker" },
      { initials: "MN", name: "Mette Nielsen", color: "bg-yellow-500", role: "Ingeniør" },
    ],
    additionalTeamMembers: 3,
    deviations: 12,
    additions: 4,
    qualityAssurance: 85,
    communicationTools: ["meet", "teams", "zoom"],
    startDate: "01-01-2024",
    endDate: "01-08-2024",
    messages: { high: 2, medium: 1, low: 3 },
    isPinned: false,
    priority: "green" as const,
  },
  {
    id: 2,
    projectId: "P-104",
    name: "Projekt Havnegade 8",
    type: "Renovering - Kontorbygning",
    category: "erhverv" as const,
    status: "igangværende" as const,
    progress: 45,
    team: [
      { initials: "KL", name: "Karen Larsen", color: "bg-green-600", role: "Arkitekt" },
      { initials: "TS", name: "Thomas Schmidt", color: "bg-purple-500", role: "Projektleder" },
    ],
    additionalTeamMembers: 4,
    deviations: 8,
    additions: 2,
    qualityAssurance: 60,
    communicationTools: ["meet", "teams", "zoom"],
    startDate: "15-02-2024",
    endDate: "15-09-2024",
    messages: { high: 0, medium: 3, low: 5 },
    isPinned: false,
    priority: "red" as const,
  },
  {
    id: 3,
    projectId: "P-105",
    name: "Projekt Stationsvej 23",
    type: "Tilbygning - Institution",
    category: "institution" as const,
    status: "igangværende" as const,
    progress: 90,
    team: [
      { initials: "MN", name: "Mette Nielsen", color: "bg-blue-600", role: "Ingeniør" },
      { initials: "PH", name: "Peter Hansen", color: "bg-orange-500", role: "VVS-Ingeniør" },
      { initials: "JA", name: "Jacob Andersen", color: "bg-indigo-500", role: "Elektriker" },
    ],
    additionalTeamMembers: 2,
    deviations: 5,
    additions: 1,
    qualityAssurance: 95,
    communicationTools: ["meet", "teams", "zoom"],
    startDate: "01-11-2023",
    endDate: "01-06-2024",
    messages: { high: 1, medium: 0, low: 0 },
    isPinned: true,
    priority: "yellow" as const,
  },
  {
    id: 4,
    projectId: "P-106",
    name: "Projekt Bredgade 45",
    type: "Nybyggeri - Erhverv",
    category: "erhverv" as const,
    status: "planlagt" as const,
    progress: 0,
    startDate: "01-06-2025",
    endDate: "01-12-2025",
    deviations: 0,
    additions: 0,
    qualityAssurance: 0,
    messages: { high: 0, medium: 0, low: 0 },
    isPinned: false,
    priority: "green" as const,
  },
  {
    id: 5,
    projectId: "P-102",
    name: "Projekt Købmagergade 18",
    type: "Renovering - Butik",
    category: "renovering" as const,
    status: "afsluttet" as const,
    progress: 100,
    team: [
      { initials: "LT", name: "Lars Thomsen", color: "bg-green-600", role: "Arkitekt" },
      { initials: "OH", name: "Ole Hansen", color: "bg-indigo-500", role: "Projektleder" },
    ],
    completionDate: "15-03-2024",
    startDate: "15-07-2023",
    endDate: "15-03-2024",
    duration: "8 måneder",
    deviations: 3,
    additions: 2,
    qualityAssurance: 100,
    messages: { high: 0, medium: 0, low: 0 },
    isPinned: false,
    priority: "grey" as const,
  }
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projects, setProjects] = useState(initialProjects);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const sortProjects = (projectsToSort) => {
    return [...projectsToSort].sort((a, b) => {
      // First sort by pinned status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by priority
      const priorityOrder = {
        "red": 0,
        "yellow": 1,
        "green": 2,
        "grey": 3
      };
      
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Then sort by status
      const statusPriority = {
        "igangværende": 0,
        "planlagt": 1,
        "afsluttet": 2
      };
      
      return statusPriority[a.status] - statusPriority[b.status];
    });
  };

  const filteredAndSortedProjects = sortProjects(
    projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === "all" || 
        project.type.toLowerCase().includes(typeFilter.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        project.status.toLowerCase() === statusFilter.toLowerCase();
      
      const matchesPriority = priorityFilter === "all" || 
        project.priority === priorityFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    })
  );

  const handleTogglePin = (projectId) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, isPinned: !project.isPinned } 
        : project
    ));
  };

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
                onTogglePin={handleTogglePin}
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
                onTogglePin={handleTogglePin}
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
            />
            <div className="flex flex-wrap space-x-2 mt-4 md:mt-0 items-center">
              <FilterSelect 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="all">Alle typer</option>
                <option value="nybyggeri">Nybyggeri</option>
                <option value="renovering">Renovering</option>
                <option value="tilbygning">Tilbygning</option>
              </FilterSelect>
              
              <FilterSelect
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="all">Alle status</option>
                <option value="igangværende">Igangværende</option>
                <option value="planlagt">Planlagt</option>
                <option value="afsluttet">Afsluttet</option>
              </FilterSelect>
              
              <FilterSelect
                onChange={(e) => setPriorityFilter(e.target.value)}
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
              
              <Button className="flex items-center">
                <Plus className="h-5 w-5 mr-1" />
                Nyt Projekt
              </Button>
            </div>
          </div>

          <TooltipProvider>
            {viewMode === "list" ? (
              <div className="space-y-8">
                {filteredAndSortedProjects.some(p => p.isPinned) && (
                  <div>
                    <h2 className="text-lg font-medium mb-4 flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
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
                          .filter(p => p.isPinned)
                          .map(project => (
                            <ProjectListItem 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {filteredAndSortedProjects.some(p => p.priority === "red" && !p.isPinned) && (
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
                          .filter(p => p.priority === "red" && !p.isPinned)
                          .map(project => (
                            <ProjectListItem 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {filteredAndSortedProjects.some(p => p.priority === "yellow" && !p.isPinned) && (
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
                          .filter(p => p.priority === "yellow" && !p.isPinned)
                          .map(project => (
                            <ProjectListItem 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {filteredAndSortedProjects.some(p => p.priority === "green" && !p.isPinned) && (
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
                          .filter(p => p.priority === "green" && !p.isPinned)
                          .map(project => (
                            <ProjectListItem 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {filteredAndSortedProjects.some(p => p.priority === "grey" && !p.isPinned) && (
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
                          .filter(p => p.priority === "grey" && !p.isPinned)
                          .map(project => (
                            <ProjectListItem 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {filteredAndSortedProjects.some(p => p.isPinned) && (
                  <div>
                    <h2 className="text-lg font-medium mb-4 flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      Fastgjorte projekter
                    </h2>
                    {viewMode === "grid" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedProjects
                          .filter(p => p.isPinned)
                          .map(project => (
                            <ProjectCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                    {viewMode === "rows" && (
                      <div className="flex flex-col space-y-2">
                        {filteredAndSortedProjects
                          .filter(p => p.isPinned)
                          .map(project => (
                            <ProjectRowCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {filteredAndSortedProjects.some(p => p.priority === "red" && !p.isPinned) && (
                  <div>
                    <h2 className="text-lg font-medium mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      Kritiske fejl
                    </h2>
                    {viewMode === "grid" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedProjects
                          .filter(p => p.priority === "red" && !p.isPinned)
                          .map(project => (
                            <ProjectCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                    {viewMode === "rows" && (
                      <div className="flex flex-col space-y-2">
                        {filteredAndSortedProjects
                          .filter(p => p.priority === "red" && !p.isPinned)
                          .map(project => (
                            <ProjectRowCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {filteredAndSortedProjects.some(p => p.priority === "yellow" && !p.isPinned) && (
                  <div>
                    <h2 className="text-lg font-medium mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      Midlertidige fejl
                    </h2>
                    {viewMode === "grid" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedProjects
                          .filter(p => p.priority === "yellow" && !p.isPinned)
                          .map(project => (
                            <ProjectCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                    {viewMode === "rows" && (
                      <div className="flex flex-col space-y-2">
                        {filteredAndSortedProjects
                          .filter(p => p.priority === "yellow" && !p.isPinned)
                          .map(project => (
                            <ProjectRowCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {filteredAndSortedProjects.some(p => p.priority === "green" && !p.isPinned) && (
                  <div>
                    <h2 className="text-lg font-medium mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
                      Fungerer som planlagt
                    </h2>
                    {viewMode === "grid" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedProjects
                          .filter(p => p.priority === "green" && !p.isPinned)
                          .map(project => (
                            <ProjectCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                    {viewMode === "rows" && (
                      <div className="flex flex-col space-y-2">
                        {filteredAndSortedProjects
                          .filter(p => p.priority === "green" && !p.isPinned)
                          .map(project => (
                            <ProjectRowCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {filteredAndSortedProjects.some(p => p.priority === "grey" && !p.isPinned) && (
                  <div>
                    <h2 className="text-lg font-medium mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-gray-500 mr-2" />
                      Afsluttede projekter
                    </h2>
                    {viewMode === "grid" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedProjects
                          .filter(p => p.priority === "grey" && !p.isPinned)
                          .map(project => (
                            <ProjectCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                    {viewMode === "rows" && (
                      <div className="flex flex-col space-y-2">
                        {filteredAndSortedProjects
                          .filter(p => p.priority === "grey" && !p.isPinned)
                          .map(project => (
                            <ProjectRowCard 
                              key={project.id} 
                              project={project} 
                              onTogglePin={handleTogglePin}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AddProjectCard />
                  </div>
                )}
                {viewMode === "rows" && (
                  <div className="mt-4">
                    <AddProjectCard />
                  </div>
                )}
              </div>
            )}
          </TooltipProvider>
        </div>
      </main>
    </div>
  );
};

export default Projects;
