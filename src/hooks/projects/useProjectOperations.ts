
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useProjectOperations = (setProjects: React.Dispatch<React.SetStateAction<any[]>>) => {
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
  }, [setProjects]);

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
  }, [setProjects]);

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
  }, [setProjects]);

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
  }, [setProjects]);

  return {
    handleTogglePin,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject
  };
};
