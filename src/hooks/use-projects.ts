
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type Project = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  type: string;
  isPinned: boolean;
  is_pinned: boolean;
  priority: string;
  progress: number;
  category: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [error, setError] = useState<Error | null>(null);
  
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

  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      
      // Map Supabase data to our project type
      const formattedProjects = data.map(project => ({
        ...project,
        isPinned: project.is_pinned,
      }));
      
      setProjects(formattedProjects);
      console.log("Projects fetched:", formattedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Der opstod en fejl ved hentning af projekter');
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const handleTogglePin = useCallback(async (projectId, isPinned) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_pinned: !isPinned })
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Update local state optimistically
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, is_pinned: !isPinned, isPinned: !isPinned } 
          : project
      ));
      
      toast.success(isPinned ? 'Projekt afpinnet' : 'Projekt pinnet');
    } catch (err) {
      console.error("Error toggling pin:", err);
      toast.error('Der opstod en fejl ved ændring af pin status');
    }
  }, []);

  const handleCreateProject = useCallback(async (projectData) => {
    try {
      console.log("Creating project with data:", projectData);
      
      // Format data for Supabase
      const formattedData = {
        ...projectData,
        is_pinned: false,
        progress: Number(projectData.progress || 0),
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert(formattedData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setProjects(prev => [...prev, { ...data, isPinned: data.is_pinned }]);
      
      toast.success('Projekt oprettet');
      return data;
    } catch (err) {
      console.error("Error creating project:", err);
      toast.error('Der opstod en fejl ved oprettelse af projektet');
      throw err;
    }
  }, []);

  const handleUpdateProject = useCallback(async (projectId, projectData) => {
    try {
      // Format data for Supabase
      const formattedData = {
        ...projectData,
        progress: Number(projectData.progress || 0),
      };
      
      const { data, error } = await supabase
        .from('projects')
        .update(formattedData)
        .eq('id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...data, isPinned: data.is_pinned } 
          : project
      ));
      
      toast.success('Projekt opdateret');
      return data;
    } catch (err) {
      console.error("Error updating project:", err);
      toast.error('Der opstod en fejl ved opdatering af projektet');
      throw err;
    }
  }, []);

  const handleDeleteProject = useCallback(async (projectId) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Update local state
      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast.success('Projekt slettet');
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error('Der opstod en fejl ved sletning af projektet');
    }
  }, []);

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
