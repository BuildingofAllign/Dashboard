
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useProjects = () => {
  const { projects, loadingProjects, fetchProjects } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Sort projects: First by priority (red, yellow, green, grey), 
  // then pinned, then by status
  const sortProjects = useCallback((projectsToSort) => {
    return [...projectsToSort].sort((a, b) => {
      // First sort by pinned status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
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
        "aktiv": 0,
        "problem": 1,
        "udfordring": 2,
        "afsluttet": 3
      };
      
      const aStatus = a.status || 'aktiv';
      const bStatus = b.status || 'aktiv';
      
      return (statusPriority[aStatus] || 99) - (statusPriority[bStatus] || 99);
    });
  }, []);

  // Filter and sort projects using useMemo to avoid unnecessary recalculations
  const filteredAndSortedProjects = useMemo(() => sortProjects(
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
  ), [projects, searchQuery, typeFilter, statusFilter, priorityFilter, sortProjects]);

  // Toggle pin status
  const handleTogglePin = async (projectId, isPinned) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_pinned: !isPinned })
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Fixed: Removed the argument as fetchProjects expects no arguments
      await fetchProjects();
      toast.success(isPinned ? 'Projekt afpinnet' : 'Projekt pinnet');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Kunne ikke opdatere pin status');
    }
  };

  // Create a new project
  const handleCreateProject = async (projectData) => {
    try {
      // Format the data for Supabase insertion
      const dataToInsert = {
        name: projectData.name,
        project_id: projectData.project_id,
        type: projectData.type,
        category: projectData.category,
        status: projectData.status,
        progress: projectData.progress,
        priority: projectData.priority,
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        description: projectData.description || null
      };

      // Insert the project
      const { data, error } = await supabase
        .from('projects')
        .insert(dataToInsert)
        .select()
        .single();
      
      if (error) throw error;
      
      // Fixed: Removed the argument as fetchProjects expects no arguments
      await fetchProjects();
      
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Kunne ikke oprette projekt');
      throw error;
    }
  };

  // Update a project
  const handleUpdateProject = async (projectId, projectData) => {
    try {
      // Format the data for Supabase update
      const dataToUpdate = {
        name: projectData.name,
        type: projectData.type,
        category: projectData.category,
        status: projectData.status,
        progress: projectData.progress,
        priority: projectData.priority,
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        description: projectData.description || null
      };

      // Update the project
      const { data, error } = await supabase
        .from('projects')
        .update(dataToUpdate)
        .eq('project_id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Fixed: Removed the argument as fetchProjects expects no arguments
      await fetchProjects();
      
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Kunne ikke opdatere projekt');
      throw error;
    }
  };

  // Fetch projects only once on component mount
  useEffect(() => {
    // Only fetch if we don't already have data
    if (projects.length === 0 && !loadingProjects) {
      fetchProjects();
    }
  }, [fetchProjects, projects.length, loadingProjects]);

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
    handleUpdateProject
  };
};
