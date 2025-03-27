import React from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Command, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/FilterButton";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { Plus } from "lucide-react";
import { Project } from "@/hooks/use-projects";
import { ComboboxOption } from "@/components/ui/Combobox";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface ProjectsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  priorityFilter: string;
  setPriorityFilter: (filter: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  filteredAndSortedProjects: Project[];
  setCommandOpen: (isOpen: boolean) => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  viewMode,
  setViewMode,
  setIsCreateDialogOpen,
  filteredAndSortedProjects,
  setCommandOpen
}) => {
  const projectTypeOptions: ComboboxOption[] = [
    { value: "all", label: "Alle typer" },
    { value: "nybyggeri", label: "Nybyggeri" },
    { value: "renovering", label: "Renovering" },
    { value: "tilbygning", label: "Tilbygning" }
  ];

  const statusOptions: ComboboxOption[] = [
    { value: "all", label: "Alle status" },
    { value: "aktiv", label: "Aktiv" },
    { value: "problem", label: "Problem" },
    { value: "udfordring", label: "Udfordring" },
    { value: "afsluttet", label: "Afsluttet" }
  ];

  const priorityOptions: ComboboxOption[] = [
    { value: "all", label: "Alle prioriteter" },
    { value: "red", label: "Kritiske fejl" },
    { value: "yellow", label: "Midlertidige fejl" },
    { value: "green", label: "Fungerer som planlagt" },
    { value: "grey", label: "Afsluttede" }
  ];

  return (
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
              <Info className="h-5 w-5 text-blue-500" />
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
          options={projectTypeOptions}
          value={typeFilter}
          onValueChange={setTypeFilter}
          className="min-w-[150px]"
          placeholder="Alle typer"
        />
        
        <FilterSelect
          options={statusOptions}
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="min-w-[150px]"
          placeholder="Alle status"
        />
        
        <FilterSelect
          options={priorityOptions}
          value={priorityFilter}
          onValueChange={setPriorityFilter}
          className="min-w-[180px]"
          placeholder="Alle prioriteter"
        />
        
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
  );
};
