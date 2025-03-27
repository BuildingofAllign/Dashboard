
import React from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Command, Info, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/FilterButton";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { Plus } from "lucide-react";
import { Project } from "@/hooks/use-projects";
import { ComboboxOption } from "@/components/ui/Combobox";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filters } from "@/components/ui/filters";
import { cn } from "@/lib/utils";

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

  // Count active filters
  const activeFilterCount = [
    typeFilter !== "all" ? 1 : 0,
    statusFilter !== "all" ? 1 : 0,
    priorityFilter !== "all" ? 1 : 0
  ].reduce((sum, current) => sum + current, 0);
  
  // Generate filter options for the combined filter dropdown
  const filtersOptions = [
    {
      title: "Projekttype",
      options: projectTypeOptions.map(option => ({
        label: option.label,
        value: `type:${option.value}`
      }))
    },
    {
      title: "Status",
      options: statusOptions.map(option => ({
        label: option.label,
        value: `status:${option.value}`
      }))
    },
    {
      title: "Prioritet",
      options: priorityOptions.map(option => ({
        label: option.label,
        value: `priority:${option.value}`
      }))
    }
  ];
  
  // Generate selected options array for the filter component
  const selectedOptions = [
    ...(typeFilter !== "all" ? [`type:${typeFilter}`] : []),
    ...(statusFilter !== "all" ? [`status:${statusFilter}`] : []),
    ...(priorityFilter !== "all" ? [`priority:${priorityFilter}`] : [])
  ];
  
  // Handle filter selection/deselection
  const handleFilterChange = (options: string[]) => {
    let newTypeFilter = "all";
    let newStatusFilter = "all";
    let newPriorityFilter = "all";
    
    options.forEach(option => {
      const [type, value] = option.split(":");
      if (type === "type") newTypeFilter = value;
      if (type === "status") newStatusFilter = value;
      if (type === "priority") newPriorityFilter = value;
    });
    
    setTypeFilter(newTypeFilter);
    setStatusFilter(newStatusFilter);
    setPriorityFilter(newPriorityFilter);
  };
  
  // Handle clearing all filters
  const handleClearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <SearchBar
            placeholder="Søg efter projekt..."
            onChange={setSearchQuery}
            value={searchQuery}
            className="w-full md:w-[300px]"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex"
            id="command-button"
            aria-label="Åbn kommandopalet"
          >
            <Command className="h-5 w-5" />
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                aria-label="Vis projektoversigt"
              >
                <Info className="h-5 w-5 text-blue-500" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Projektoversigt</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aktive projekter:</span>
                    <Badge variant="outline" className="bg-green-100">
                      {filteredAndSortedProjects.filter(p => p.status === "aktiv").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Problem projekter:</span>
                    <Badge variant="outline" className="bg-red-100">
                      {filteredAndSortedProjects.filter(p => p.status === "problem").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Udfordrende projekter:</span>
                    <Badge variant="outline" className="bg-yellow-100">
                      {filteredAndSortedProjects.filter(p => p.status === "udfordring").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Afsluttede projekter:</span>
                    <Badge variant="outline" className="bg-gray-100">
                      {filteredAndSortedProjects.filter(p => p.status === "afsluttet").length}
                    </Badge>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Consolidated filter dropdown using Gestalt principle of similarity */}
            <Filters
              placeholder={activeFilterCount > 0 ? `${activeFilterCount} filtre aktive` : "Filtre"}
              filtersOptions={filtersOptions}
              selectedOptions={selectedOptions}
              onSelectedOptionsChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              className={cn(
                "border-dashed",
                activeFilterCount > 0 && "border-primary text-primary"
              )}
            />
            <ViewToggle currentView={viewMode} onChange={setViewMode} />
          </div>
          
          <Button 
            className="flex items-center gap-1"
            onClick={() => setIsCreateDialogOpen(true)}
            id="create-project-button"
          >
            <Plus className="h-5 w-5" />
            Nyt Projekt
          </Button>
        </div>
      </div>
      
      {/* Active filter indicators - Gestalt principle of common region */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Aktive filtre:</span>
          
          {typeFilter !== "all" && (
            <Badge variant="outline" className="font-normal">
              Type: {projectTypeOptions.find(o => o.value === typeFilter)?.label}
            </Badge>
          )}
          
          {statusFilter !== "all" && (
            <Badge variant="outline" className="font-normal">
              Status: {statusOptions.find(o => o.value === statusFilter)?.label}
            </Badge>
          )}
          
          {priorityFilter !== "all" && (
            <Badge variant="outline" className="font-normal">
              Prioritet: {priorityOptions.find(o => o.value === priorityFilter)?.label}
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={handleClearFilters}
          >
            Ryd alle
          </Button>
        </div>
      )}
      
      <Separator className={activeFilterCount > 0 ? "visible" : "hidden"} />
    </div>
  );
};
