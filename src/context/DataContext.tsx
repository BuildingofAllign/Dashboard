
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, generateEntityId } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type DataContextType = {
  // Projects
  projects: any[];
  loadingProjects: boolean;
  fetchProjects: () => Promise<void>;
  createProject: (projectData: any) => Promise<any>;
  updateProject: (id: string, projectData: any) => Promise<any>;
  togglePinProject: (id: string, isPinned: boolean) => Promise<void>;
  
  // Deviations
  deviations: any[];
  loadingDeviations: boolean;
  fetchDeviations: () => Promise<void>;
  createDeviation: (deviationData: any) => Promise<any>;
  updateDeviation: (id: string, data: any) => Promise<any>;
  addDeviationComment: (deviationId: string, author: string, text: string) => Promise<any>;
  
  // Additional Tasks
  additionalTasks: any[];
  loadingAdditionalTasks: boolean;
  fetchAdditionalTasks: () => Promise<void>;
  createAdditionalTask: (taskData: any) => Promise<any>;
  updateAdditionalTask: (id: string, data: any) => Promise<any>;

  // Drawings
  drawings: any[];
  loadingDrawings: boolean;
  fetchDrawings: () => Promise<void>;
  
  // Employees
  employees: any[];
  loadingEmployees: boolean;
  fetchEmployees: () => Promise<void>;
  
  // User preferences
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // State for each data type
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  const [deviations, setDeviations] = useState<any[]>([]);
  const [loadingDeviations, setLoadingDeviations] = useState(true);
  
  const [additionalTasks, setAdditionalTasks] = useState<any[]>([]);
  const [loadingAdditionalTasks, setLoadingAdditionalTasks] = useState(true);
  
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loadingDrawings, setLoadingDrawings] = useState(true);
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Fetch functions
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_team_members(*), project_stats(*), project_communication_tools(*), project_messages(*)');
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error('Error loading projects', { description: error.message });
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };
  
  const fetchDeviations = async () => {
    try {
      setLoadingDeviations(true);
      const { data, error } = await supabase
        .from('deviations')
        .select('*, deviation_comments(*)');
      
      if (error) throw error;
      setDeviations(data || []);
    } catch (error: any) {
      toast.error('Error loading deviations', { description: error.message });
      console.error('Error fetching deviations:', error);
    } finally {
      setLoadingDeviations(false);
    }
  };
  
  const fetchAdditionalTasks = async () => {
    try {
      setLoadingAdditionalTasks(true);
      const { data, error } = await supabase
        .from('additional_tasks')
        .select('*');
      
      if (error) throw error;
      setAdditionalTasks(data || []);
    } catch (error: any) {
      toast.error('Error loading additional tasks', { description: error.message });
      console.error('Error fetching additional tasks:', error);
    } finally {
      setLoadingAdditionalTasks(false);
    }
  };
  
  const fetchDrawings = async () => {
    try {
      setLoadingDrawings(true);
      const { data, error } = await supabase
        .from('drawings')
        .select('*, drawing_annotation_markers(*)');
      
      if (error) throw error;
      setDrawings(data || []);
    } catch (error: any) {
      toast.error('Error loading drawings', { description: error.message });
      console.error('Error fetching drawings:', error);
    } finally {
      setLoadingDrawings(false);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*, employee_communication_tools(*)');
      
      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast.error('Error loading employees', { description: error.message });
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Create and update functions
  const createProject = async (projectData: any) => {
    try {
      // Generate a unique project ID with P- prefix
      const projectId = generateEntityId('P');
      
      // Insert the project first
      const { data: projectRecord, error: projectError } = await supabase
        .from('projects')
        .insert({ ...projectData, project_id: projectId })
        .select()
        .single();
      
      if (projectError) throw projectError;
      
      toast.success('Project created successfully');
      await fetchProjects();
      return projectRecord;
    } catch (error: any) {
      toast.error('Error creating project', { description: error.message });
      console.error('Error creating project:', error);
      throw error;
    }
  };
  
  const updateProject = async (id: string, projectData: any) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Project updated successfully');
      await fetchProjects();
      return data;
    } catch (error: any) {
      toast.error('Error updating project', { description: error.message });
      console.error('Error updating project:', error);
      throw error;
    }
  };
  
  const togglePinProject = async (id: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_pinned: !isPinned })
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProjects();
      toast.success(isPinned ? 'Project unpinned' : 'Project pinned');
    } catch (error: any) {
      toast.error('Error toggling pin status', { description: error.message });
      console.error('Error toggling pin status:', error);
    }
  };

  const createDeviation = async (deviationData: any) => {
    try {
      // Generate a unique deviation ID with AFV- prefix
      const deviationId = generateEntityId('AFV');
      
      const { data, error } = await supabase
        .from('deviations')
        .insert({ ...deviationData, deviation_id: deviationId })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Deviation created successfully');
      await fetchDeviations();
      return data;
    } catch (error: any) {
      toast.error('Error creating deviation', { description: error.message });
      console.error('Error creating deviation:', error);
      throw error;
    }
  };
  
  const updateDeviation = async (id: string, data: any) => {
    try {
      const { data: updatedData, error } = await supabase
        .from('deviations')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Deviation updated successfully');
      await fetchDeviations();
      return updatedData;
    } catch (error: any) {
      toast.error('Error updating deviation', { description: error.message });
      console.error('Error updating deviation:', error);
      throw error;
    }
  };
  
  const addDeviationComment = async (deviationId: string, author: string, text: string) => {
    try {
      const { data, error } = await supabase
        .from('deviation_comments')
        .insert({
          deviation_id: deviationId,
          author,
          text
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Comment added successfully');
      await fetchDeviations();
      return data;
    } catch (error: any) {
      toast.error('Error adding comment', { description: error.message });
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const createAdditionalTask = async (taskData: any) => {
    try {
      // Generate a unique task ID with AT- prefix
      const taskId = generateEntityId('AT');
      
      const { data, error } = await supabase
        .from('additional_tasks')
        .insert({ ...taskData, task_id: taskId })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Additional task created successfully');
      await fetchAdditionalTasks();
      return data;
    } catch (error: any) {
      toast.error('Error creating additional task', { description: error.message });
      console.error('Error creating additional task:', error);
      throw error;
    }
  };
  
  const updateAdditionalTask = async (id: string, data: any) => {
    try {
      const { data: updatedData, error } = await supabase
        .from('additional_tasks')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Additional task updated successfully');
      await fetchAdditionalTasks();
      return updatedData;
    } catch (error: any) {
      toast.error('Error updating additional task', { description: error.message });
      console.error('Error updating additional task:', error);
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchProjects();
    fetchDeviations();
    fetchAdditionalTasks();
    fetchDrawings();
    fetchEmployees();
  }, []);

  const value = {
    // Projects
    projects,
    loadingProjects,
    fetchProjects,
    createProject,
    updateProject,
    togglePinProject,
    
    // Deviations
    deviations,
    loadingDeviations,
    fetchDeviations,
    createDeviation,
    updateDeviation,
    addDeviationComment,
    
    // Additional Tasks
    additionalTasks,
    loadingAdditionalTasks,
    fetchAdditionalTasks,
    createAdditionalTask,
    updateAdditionalTask,
    
    // Drawings
    drawings,
    loadingDrawings,
    fetchDrawings,
    
    // Employees
    employees,
    loadingEmployees,
    fetchEmployees,
    
    // User preferences
    theme,
    toggleTheme,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
