
import { useState, useEffect, useCallback } from 'react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Fetch projects from Supabase
  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_team_members(*),
          project_stats(*),
          project_communication_tools(*),
          project_messages(*)
        `);
      
      if (error) throw error;
      
      // Transform data to match the expected format in components
      const transformedProjects = data.map(project => ({
        id: project.id,
        projectId: project.project_id,
        name: project.name,
        type: project.type,
        category: project.category,
        status: project.status,
        progress: project.progress,
        isPinned: project.is_pinned,
        priority: project.priority || 'green',
        startDate: project.start_date,
        endDate: project.end_date,
        description: project.description,
        team: project.project_team_members,
        deviations: project.project_stats?.[0]?.deviations || 0,
        additions: project.project_stats?.[0]?.additions || 0,
        qualityAssurance: project.project_stats?.[0]?.quality_assurance || 0,
        communicationTools: project.project_communication_tools?.map(tool => tool.tool) || [],
        messages: {
          high: project.project_messages?.find(m => m.priority === 'high')?.count || 0,
          medium: project.project_messages?.find(m => m.priority === 'medium')?.count || 0,
          low: project.project_messages?.find(m => m.priority === 'low')?.count || 0,
        }
      }));
      
      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Kunne ikke hente projekter');
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Sort projects: First by priority (red, yellow, green, grey), 
  // then pinned, then by status
  const sortProjects = (projectsToSort) => {
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
  };

  // Filter and sort projects
  const filteredAndSortedProjects = sortProjects(
    projects.filter(project => {
      // Search filter
      const matchesSearch = 
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectId?.toLowerCase().includes(searchQuery.toLowerCase());
      
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
  const handleTogglePin = async (projectId, isPinned) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_pinned: !isPinned })
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Update local state
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId 
            ? { ...project, isPinned: !isPinned } 
            : project
        )
      );
      
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
      
      // Refresh projects to get the updated list
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
      
      // Refresh projects to get the updated list
      await fetchProjects();
      
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Kunne ikke opdatere projekt');
      throw error;
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
    refreshProjects,
    handleTogglePin,
    handleCreateProject,
    handleUpdateProject
  };
};
