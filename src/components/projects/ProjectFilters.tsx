
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { FilterCategory } from "./filters/FilterCategory";
import { StatusFilter } from "./filters/StatusFilter";
import { PriorityFilter } from "./filters/PriorityFilter";
import { ProgressFilter } from "./filters/ProgressFilter";
import { TeamMemberFilter } from "./filters/TeamMemberFilter";
import { SortingFilter } from "./filters/SortingFilter";

export type ProjectCategory = "bolig" | "erhverv" | "institution" | "renovering" | "andet";
export type ProjectStatus = "igangværende" | "planlagt" | "afsluttet";
export type ProjectPriority = "high" | "medium" | "low" | "none";

export interface ProjectFiltersState {
  searchTerm: string;
  categories: ProjectCategory[];
  statuses: ProjectStatus[];
  priorities: ProjectPriority[];
  progressMin: number;
  progressMax: number;
  teamMembers: string[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

const defaultFilters: ProjectFiltersState = {
  searchTerm: '',
  categories: [],
  statuses: [],
  priorities: [],
  progressMin: 0,
  progressMax: 100,
  teamMembers: [],
  sortBy: 'name',
  sortDirection: 'asc'
};

interface ProjectFiltersProps {
  onChange: (filters: ProjectFiltersState) => void;
  teamMembers?: { id: string; name: string; initials: string }[];
  onClear?: () => void;
  className?: string;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  onChange,
  teamMembers = [],
  onClear,
  className = ""
}) => {
  const [filters, setFilters] = useState<ProjectFiltersState>(defaultFilters);
  const [expanded, setExpanded] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const updateFilters = (partialFilters: Partial<ProjectFiltersState>) => {
    const newFilters = { ...filters, ...partialFilters };
    setFilters(newFilters);
    onChange(newFilters);
    
    // Count active filters
    let count = 0;
    if (newFilters.searchTerm) count++;
    if (newFilters.categories.length) count++;
    if (newFilters.statuses.length) count++;
    if (newFilters.priorities.length) count++;
    if (newFilters.progressMin > 0 || newFilters.progressMax < 100) count++;
    if (newFilters.teamMembers.length) count++;
    
    setActiveFilterCount(count);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setActiveFilterCount(0);
    if (onClear) onClear();
    onChange(defaultFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(filters);
  };

  const toggleCategory = (category: ProjectCategory) => {
    if (filters.categories.includes(category)) {
      updateFilters({ categories: filters.categories.filter(c => c !== category) });
    } else {
      updateFilters({ categories: [...filters.categories, category] });
    }
  };

  const toggleStatus = (status: ProjectStatus) => {
    if (filters.statuses.includes(status)) {
      updateFilters({ statuses: filters.statuses.filter(s => s !== status) });
    } else {
      updateFilters({ statuses: [...filters.statuses, status] });
    }
  };

  const togglePriority = (priority: ProjectPriority) => {
    if (filters.priorities.includes(priority)) {
      updateFilters({ priorities: filters.priorities.filter(p => p !== priority) });
    } else {
      updateFilters({ priorities: [...filters.priorities, priority] });
    }
  };

  const toggleTeamMember = (memberId: string) => {
    if (filters.teamMembers.includes(memberId)) {
      updateFilters({ teamMembers: filters.teamMembers.filter(id => id !== memberId) });
    } else {
      updateFilters({ teamMembers: [...filters.teamMembers, memberId] });
    }
  };

  const updateProgress = (min: number, max: number) => {
    updateFilters({ progressMin: min, progressMax: max });
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Projekt filter
            {activeFilterCount > 0 && (
              <Badge className="ml-2 bg-indigo-600">{activeFilterCount}</Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button 
                className="flex items-center text-sm text-gray-500 hover:text-gray-700" 
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Nulstil
              </button>
            )}
            
            <CollapsibleTrigger
              onClick={() => setExpanded(!expanded)}
              className="rounded-md p-2 hover:bg-gray-100 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </CollapsibleTrigger>
          </div>
        </div>
      </CardHeader>
      
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CardContent className="px-4 py-3 space-y-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="search"
                placeholder="Søg efter projekter..."
                value={filters.searchTerm}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>
          
          <CollapsibleContent>
            <div className="space-y-4 pt-3">
              {/* Kategori filter */}
              <FilterCategory 
                categories={filters.categories} 
                toggleCategory={toggleCategory} 
              />
              
              {/* Status filter */}
              <StatusFilter 
                statuses={filters.statuses} 
                toggleStatus={toggleStatus} 
              />
              
              {/* Prioritet filter */}
              <PriorityFilter 
                priorities={filters.priorities} 
                togglePriority={togglePriority} 
              />
              
              {/* Fremgang filter */}
              <ProgressFilter 
                progressMin={filters.progressMin} 
                progressMax={filters.progressMax} 
                updateProgress={updateProgress} 
              />
              
              {/* Team member filter */}
              <TeamMemberFilter 
                teamMembers={teamMembers} 
                selectedTeamMembers={filters.teamMembers} 
                toggleTeamMember={toggleTeamMember} 
              />
              
              {/* Sortering */}
              <SortingFilter 
                sortBy={filters.sortBy} 
                sortDirection={filters.sortDirection} 
                updateSortBy={(value) => updateFilters({ sortBy: value })} 
                updateSortDirection={(value) => updateFilters({ sortDirection: value })} 
              />
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};
