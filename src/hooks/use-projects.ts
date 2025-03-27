
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

  // Sort projects: Pinned first, then by status (active, planned, completed)
  const sortProjects = (projectsToSort: any[]) => {
    return [...projectsToSort].sort((a, b) => {
      // First sort by pinned status
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      
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
      
      return matchesSearch && matchesType && matchesStatus;
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
    refreshProjects: fetchProjects,
    handleTogglePin,
    handleCreateProject,
    handleUpdateProject
  };
};
