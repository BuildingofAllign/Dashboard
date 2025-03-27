
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '../projects-types';

export const useProjectsData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  return {
    projects,
    setProjects,
    loadingProjects,
    error,
    fetchProjects
  };
};
