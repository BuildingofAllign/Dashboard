
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Home, 
  Building, 
  Building2, 
  ConstructionIcon, 
  Factory,
  Users,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                <X className="h-4 w-4 mr-1" />
                Nulstil
              </Button>
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
              <div>
                <h4 className="text-sm font-medium mb-2">Kategori</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.categories.includes('bolig') ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCategory('bolig')}
                    className="h-8"
                  >
                    <Home className="h-3 w-3 mr-1" />
                    Bolig
                  </Button>
                  <Button
                    variant={filters.categories.includes('erhverv') ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCategory('erhverv')}
                    className="h-8"
                  >
                    <Building className="h-3 w-3 mr-1" />
                    Erhverv
                  </Button>
                  <Button
                    variant={filters.categories.includes('institution') ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCategory('institution')}
                    className="h-8"
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    Institution
                  </Button>
                  <Button
                    variant={filters.categories.includes('renovering') ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCategory('renovering')}
                    className="h-8"
                  >
                    <ConstructionIcon className="h-3 w-3 mr-1" />
                    Renovering
                  </Button>
                  <Button
                    variant={filters.categories.includes('andet') ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCategory('andet')}
                    className="h-8"
                  >
                    <Factory className="h-3 w-3 mr-1" />
                    Andet
                  </Button>
                </div>
              </div>
              
              {/* Status filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div className="flex gap-2">
                  <Button
                    variant={filters.statuses.includes('igangværende') ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleStatus('igangværende')}
                    className="h-8"
                  >
                    Igangværende
                  </Button>
                  <Button
                    variant={filters.statuses.includes('planlagt') ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleStatus('planlagt')}
                    className="h-8"
                  >
                    Planlagt
                  </Button>
                  <Button
                    variant={filters.statuses.includes('afsluttet') ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleStatus('afsluttet')}
                    className="h-8"
                  >
                    Afsluttet
                  </Button>
                </div>
              </div>
              
              {/* Prioritet filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Prioritet</h4>
                <div className="flex gap-2">
                  <Button
                    variant={filters.priorities.includes('high') ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePriority('high')}
                    className="h-8 bg-red-600 text-white hover:bg-red-700"
                  >
                    Høj
                  </Button>
                  <Button
                    variant={filters.priorities.includes('medium') ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePriority('medium')}
                    className="h-8 bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Medium
                  </Button>
                  <Button
                    variant={filters.priorities.includes('low') ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePriority('low')}
                    className="h-8 bg-green-600 text-white hover:bg-green-700"
                  >
                    Lav
                  </Button>
                  <Button
                    variant={filters.priorities.includes('none') ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePriority('none')}
                    className="h-8"
                  >
                    Ingen
                  </Button>
                </div>
              </div>
              
              {/* Fremgang filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Fremgang</h4>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ progressMin: 0, progressMax: 25 })}
                    className={`h-8 ${
                      filters.progressMin === 0 && filters.progressMax === 25 ? 'border-red-500' : ''
                    }`}
                  >
                    0-25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ progressMin: 26, progressMax: 50 })}
                    className={`h-8 ${
                      filters.progressMin === 26 && filters.progressMax === 50 ? 'border-yellow-500' : ''
                    }`}
                  >
                    26-50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ progressMin: 51, progressMax: 75 })}
                    className={`h-8 ${
                      filters.progressMin === 51 && filters.progressMax === 75 ? 'border-blue-500' : ''
                    }`}
                  >
                    51-75%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ progressMin: 76, progressMax: 100 })}
                    className={`h-8 ${
                      filters.progressMin === 76 && filters.progressMax === 100 ? 'border-green-500' : ''
                    }`}
                  >
                    76-100%
                  </Button>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">{filters.progressMin}%</span>
                    <span className="text-xs">{filters.progressMax}%</span>
                  </div>
                  <Progress value={filters.progressMax} className="h-2" />
                </div>
              </div>
              
              {/* Team member filter */}
              {teamMembers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Medarbejdere</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Users className="h-3 w-3 mr-1" />
                        Vælg medarbejdere
                        {filters.teamMembers.length > 0 && (
                          <Badge className="ml-2 bg-indigo-600">{filters.teamMembers.length}</Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <div className="p-2">
                        {teamMembers.map(member => (
                          <div 
                            key={member.id}
                            className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => toggleTeamMember(member.id)}
                          >
                            <input 
                              type="checkbox" 
                              checked={filters.teamMembers.includes(member.id)}
                              onChange={() => {}}
                              className="mr-2"
                            />
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mr-2">
                                {member.initials}
                              </div>
                              <span className="text-sm">{member.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              {/* Sortering */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium mb-1">Sorter efter</h4>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilters({ sortBy: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Vælg sortering" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Navn</SelectItem>
                      <SelectItem value="projectId">Projekt ID</SelectItem>
                      <SelectItem value="progress">Fremgang</SelectItem>
                      <SelectItem value="startDate">Startdato</SelectItem>
                      <SelectItem value="endDate">Slutdato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium mb-1">Retning</h4>
                  <Select
                    value={filters.sortDirection}
                    onValueChange={(value) => updateFilters({ sortDirection: value as 'asc' | 'desc' })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Vælg retning" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Stigende</SelectItem>
                      <SelectItem value="desc">Faldende</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};
