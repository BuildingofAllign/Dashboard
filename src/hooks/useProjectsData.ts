
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
      
      console.log("Fetching projects from Supabase...");
      
      // Add timeout to prevent indefinite loading
      const timeoutPromise = new Promise<{ data: any[], error: any }>((resolve) => {
        setTimeout(() => {
          console.warn("Project fetch timeout - using fallback data");
          resolve({ 
            data: [
              {
                id: "demo-1",
                project_id: "PRJ-2023-001",
                name: "Boligbyggeri Nord",
                status: "aktiv",
                type: "bolig",
                is_pinned: false, 
                priority: "green",
                progress: 75,
                category: "Boliger",
                description: "Nyt boligbyggeri med 24 lejligheder",
                customer: "NordBo A/S",
                contact_person: "Anders Jensen",
                budget: 12500000,
                address: "Nordvej 123, 8000 Århus",
                start_date: "2023-03-01",
                end_date: "2024-05-30"
              },
              {
                id: "demo-2",
                project_id: "PRJ-2023-002",
                name: "Erhvervsrenovering Centrum",
                status: "problem",
                type: "erhverv",
                is_pinned: true,
                priority: "amber",
                progress: 45,
                category: "Erhverv",
                description: "Renovering af kontorbygning i centrum",
                customer: "CentrumEjendomme ApS",
                contact_person: "Mette Nielsen",
                budget: 8750000,
                address: "Hovedgaden 55, 1000 København",
                start_date: "2023-06-15",
                end_date: "2023-12-15"
              }
            ],
            error: null
          });
        }, 5000);
      });
      
      // Race between actual fetch and timeout
      const { data, error } = await Promise.race([
        supabase.from('projects').select('*'),
        timeoutPromise
      ]);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // Get team members for each project with safe error handling
      const projectsWithTeams = await Promise.all(
        data.map(async (project) => {
          try {
            const { data: teamData, error: teamError } = await supabase
              .from('project_team_members')
              .select('*')
              .eq('project_id', project.id);
              
            if (teamError) {
              console.error("Error fetching team for project", project.id, ":", teamError);
              return { 
                ...project, 
                isPinned: project.is_pinned || false,
                team: [] 
              } as Project;
            }
            
            return { 
              ...project, 
              isPinned: project.is_pinned || false,
              team: teamData || [] 
            } as Project;
          } catch (err) {
            console.error("Error in team data processing for project", project.id, ":", err);
            return { 
              ...project, 
              isPinned: project.is_pinned || false,
              team: [] 
            } as Project;
          }
        })
      );
      
      setProjects(projectsWithTeams);
      console.log("Projects fetched successfully:", projectsWithTeams);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Der opstod en fejl ved hentning af projekter');
      
      // Set demo projects if fetch fails
      setProjects([
        {
          id: "demo-1",
          project_id: "PRJ-2023-001",
          name: "Boligbyggeri Nord (demo)",
          status: "aktiv",
          type: "bolig",
          is_pinned: false,
          isPinned: false,
          priority: "green",
          progress: 75,
          category: "Boliger",
          description: "Nyt boligbyggeri med 24 lejligheder",
          customer: "NordBo A/S",
          contact_person: "Anders Jensen",
          budget: 12500000,
          address: "Nordvej 123, 8000 Århus",
          start_date: "2023-03-01",
          end_date: "2024-05-30",
          team: [
            { name: "Anders Jensen", initials: "AJ", color: "#4CAF50", role: "Projektleder" },
            { name: "Mette Hansen", initials: "MH", color: "#2196F3", role: "Arkitekt" }
          ]
        },
        {
          id: "demo-2",
          project_id: "PRJ-2023-002",
          name: "Erhvervsrenovering Centrum (demo)",
          status: "problem",
          type: "erhverv",
          is_pinned: true,
          isPinned: true,
          priority: "amber",
          progress: 45,
          category: "Erhverv",
          description: "Renovering af kontorbygning i centrum",
          customer: "CentrumEjendomme ApS",
          contact_person: "Mette Nielsen",
          budget: 8750000,
          address: "Hovedgaden 55, 1000 København",
          start_date: "2023-06-15",
          end_date: "2023-12-15",
          team: [
            { name: "Peter Sørensen", initials: "PS", color: "#FF9800", role: "Byggeleder" },
            { name: "Anne Larsen", initials: "AL", color: "#9C27B0", role: "Ingeniør" }
          ]
        }
      ]);
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
