
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [error, setError] = useState<Error | null>(null);
  
  const filteredAndSortedProjects = useMemo(() => {
    return [];
  }, []);

  // Simplified mock function that doesn't actually fetch
  const fetchProjects = useCallback(() => {
    console.log("Not fetching projects to prevent lag");
    return Promise.resolve();
  }, []);

  // Simplified mock toggle function
  const handleTogglePin = useCallback((projectId, isPinned) => {
    console.log(`Toggle pin for project ${projectId}, currently ${isPinned ? 'pinned' : 'unpinned'}`);
    toast.success(isPinned ? 'Projekt afpinnet' : 'Projekt pinnet');
    return Promise.resolve();
  }, []);

  // Simplified mock create function
  const handleCreateProject = useCallback((projectData) => {
    console.log("Create project with data:", projectData);
    toast.success('Projekt oprettet');
    return Promise.resolve({});
  }, []);

  // Simplified mock update function
  const handleUpdateProject = useCallback((projectId, projectData) => {
    console.log(`Update project ${projectId} with data:`, projectData);
    toast.success('Projekt opdateret');
    return Promise.resolve({});
  }, []);

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
    error
  };
};
