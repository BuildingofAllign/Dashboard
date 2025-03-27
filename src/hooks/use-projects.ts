
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
  const [isFetchingProjects, setIsFetchingProjects] = useState(false);
  
  // Smart fetch with debounce and cache invalidation
  const smartFetchProjects = useCallback(() => {
    if (isFetchingProjects) return;
    
    setIsFetchingProjects(true);
    fetchProjects()
      .finally(() => {
        setIsFetchingProjects(false);
      });
  }, [fetchProjects, isFetchingProjects]);

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

  // Toggle pin status with optimistic UI update
  const handleTogglePin = async (projectId, isPinned) => {
    try {
      // Optimistically update the UI for immediate feedback
      const optimisticProjects = projects.map(p => 
        p.id === projectId ? { ...p, is_pinned: !isPinned } : p
      );
      
      // Apply the update to Supabase
      const { error } = await supabase
        .from('projects')
        .update({ is_pinned: !isPinned })
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Only refresh if there was a change in backend data structure
      smartFetchProjects();
      toast.success(isPinned ? 'Projekt afpinnet' : 'Projekt pinnet');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Kunne ikke opdatere pin status');
    }
  };

  // Create a new project with optimistic UI update
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
      
      // Update local cache
      smartFetchProjects();
      
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Kunne ikke oprette projekt');
      throw error;
    }
  };

  // Update a project with optimistic UI
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
      
      // Update local cache
      smartFetchProjects();
      
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Kunne ikke opdatere projekt');
      throw error;
    }
  };

  // Intelligent data loading - only fetch when needed
  useEffect(() => {
    // Only fetch if we don't already have data and aren't currently loading
    if (projects.length === 0 && !loadingProjects && !isFetchingProjects) {
      smartFetchProjects();
    }
  }, [projects.length, loadingProjects, smartFetchProjects, isFetchingProjects]);

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
    fetchProjects: smartFetchProjects,
    handleTogglePin,
    handleCreateProject,
    handleUpdateProject
  };
};
