
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

export const useProjects = () => {
  const { 
    projects, 
    loadingProjects, 
    fetchProjects,
    createProject,
    updateProject,
    togglePinProject: togglePin
  } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Sort projects: First by priority (red, yellow, green, grey), 
  // then pinned, then by status (active, planned, completed)
  const sortProjects = (projectsToSort: any[]) => {
    return [...projectsToSort].sort((a, b) => {
      // First sort by pinned status
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      
      // Then by priority
      const priorityOrder = {
        "red": 0,
        "yellow": 1,
        "green": 2,
        "grey": 3
      };
      
      const aPriority = a.priority || 'green';
      const bPriority = b.priority || 'green';
      
      if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      }
      
      // Then sort by status priority
      const statusPriority = {
        "igangværende": 0,
        "planlagt": 1,
        "afsluttet": 2
      };
      
      const aStatus = a.status || 'igangværende';
      const bStatus = b.status || 'igangværende';
      
      return (statusPriority[aStatus] || 99) - (statusPriority[bStatus] || 99);
    });
  };

  // Filter and sort projects
  const filteredAndSortedProjects = sortProjects(
    projects.filter(project => {
      // Search filter
      const matchesSearch = 
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.project_id?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = typeFilter === "all" || 
        project.type?.toLowerCase().includes(typeFilter.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || 
        project.status?.toLowerCase() === statusFilter.toLowerCase();
      
      // Priority filter
      const matchesPriority = priorityFilter === "all" || 
        project.priority === priorityFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    })
  );

  // Toggle pin status
  const handleTogglePin = async (projectId: string, isPinned: boolean) => {
    try {
      await togglePin(projectId, isPinned);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Create a new project
  const handleCreateProject = async (projectData: any) => {
    try {
      await createProject(projectData);
      toast.success("Nyt projekt oprettet!");
      return true;
    } catch (error) {
      return false;
    }
  };

  // Update a project
  const handleUpdateProject = async (id: string, projectData: any) => {
    try {
      await updateProject(id, projectData);
      toast.success("Projekt opdateret!");
      return true;
    } catch (error) {
      return false;
    }
  };

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
    refreshProjects: fetchProjects,
    handleTogglePin,
    handleCreateProject,
    handleUpdateProject
  };
};
