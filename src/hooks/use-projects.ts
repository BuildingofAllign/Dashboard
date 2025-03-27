
import { useEffect } from 'react';
import { useProjectsData } from './projects/useProjectsData';
import { useProjectsFilter } from './projects/useProjectsFilter';
import { useProjectOperations } from './projects/useProjectOperations';
import { Project } from './projects-types';

export type { Project };

export const useProjects = () => {
  const { 
    projects, 
    setProjects, 
    loadingProjects, 
    error, 
    fetchProjects 
  } = useProjectsData();

  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredAndSortedProjects
  } = useProjectsFilter(projects);

  const {
    handleTogglePin,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject
  } = useProjectOperations(setProjects);

  // Load projects on initial render
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
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
    fetchProjects,
    handleTogglePin,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    error
  };
};
