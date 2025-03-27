
import React, { useState } from "react";
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
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

// Demo project data
const DEMO_PROJECTS = [
  {
    id: 1,
    projectId: "P-2023-001",
    name: "Demo Boligbyggeri",
    status: "aktiv",
    type: "Nybyggeri",
    isPinned: true,
    priority: "green",
    progress: 45,
    deviations: 2,
    additions: 1,
    qualityAssurance: 78,
    team: [
      { name: "Anders Jensen", initials: "AJ", color: "#4f46e5" },
      { name: "Mette Nielsen", initials: "MN", color: "#10b981" }
    ]
  },
  {
    id: 2,
    projectId: "P-2023-002",
    name: "Demo Renovering",
    status: "problem",
    type: "Renovering",
    isPinned: false,
    priority: "red",
    progress: 30,
    deviations: 7,
    additions: 3,
    qualityAssurance: 45,
    team: [
      { name: "Lars Pedersen", initials: "LP", color: "#f59e0b" }
    ]
  }
];

const Projects = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  
  // Demo implementation that doesn't rely on DataContext
  const handleTogglePin = (projectId) => {
    console.log(`Toggle pin for project ${projectId}`);
  };

  const filteredProjects = isDataAvailable ? DEMO_PROJECTS : [];

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

          {!isDataAvailable ? (
            <EmptyState
              title="Ingen projekter"
              description="Der er ingen projekter at vise på nuværende tidspunkt."
              icon="file"
              actionLabel="Opret nyt projekt"
              onAction={() => setIsCreateDialogOpen(true)}
            />
          ) : (
            <TooltipProvider>
              {viewMode === "list" ? (
                // List view would go here
                <div className="space-y-8">
                  <EmptyState
                    title="Listevisning"
                    description="Denne visning er under udvikling."
                    icon="search"
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredProjects.length === 0 ? (
                    <EmptyState
                      title="Ingen matchende projekter"
                      description="Der blev ikke fundet nogen projekter der matcher dine filtre."
                      icon="search"
                    />
                  ) : (
                    <>
                      {/* Grid or rows view would go here */}
                      <EmptyState
                        title="Ingen projekter matcher filtre"
                        description="Prøv at ændre dine filtre for at se flere projekter."
                        icon="search"
                      />
                    </>
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
