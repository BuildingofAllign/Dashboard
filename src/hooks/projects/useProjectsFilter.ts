
import { useState, useMemo } from 'react';
import { Project } from '../projects-types';

export const useProjectsFilter = (projects: Project[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.project_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(project => 
        project.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => 
        project.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(project => 
        project.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }
    
    // Sort by pinned first, then by name
    return filtered.sort((a, b) => {
      if ((a.is_pinned || a.isPinned) && !(b.is_pinned || b.isPinned)) return -1;
      if (!(a.is_pinned || a.isPinned) && (b.is_pinned || b.isPinned)) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [projects, searchQuery, typeFilter, statusFilter, priorityFilter]);

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredAndSortedProjects
  };
};
