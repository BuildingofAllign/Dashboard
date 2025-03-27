import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
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

// Cache time in milliseconds (5 minutes)
const CACHE_TIME = 5 * 60 * 1000;

// Enhanced caching strategy for different data types
const CACHE_STRATEGIES = {
  PROJECTS: {
    staleTime: 10 * 60 * 1000, // 10 minutes for projects
    prefetch: true,            // Prefetch on app load
    priority: 'high'           // High priority data
  },
  DEVIATIONS: {
    staleTime: 5 * 60 * 1000,  // 5 minutes for deviations
    prefetch: true,
    priority: 'high'
  },
  ADDITIONAL_TASKS: {
    staleTime: 15 * 60 * 1000, // 15 minutes for tasks
    prefetch: false,           // Load when needed
    priority: 'medium'
  },
  DRAWINGS: {
    staleTime: 30 * 60 * 1000, // 30 minutes for drawings
    prefetch: false,
    priority: 'low'
  },
  EMPLOYEES: {
    staleTime: 60 * 60 * 1000, // 1 hour for employees
    prefetch: false,
    priority: 'low'
  }
};

// Add debounce function to limit API calls
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // State for each data type
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectsLastFetch, setProjectsLastFetch] = useState(0);
  const [projectsFetchInProgress, setProjectsFetchInProgress] = useState(false);
  
  const [deviations, setDeviations] = useState<any[]>([]);
  const [loadingDeviations, setLoadingDeviations] = useState(false);
  const [deviationsLastFetch, setDeviationsLastFetch] = useState(0);
  const [deviationsFetchInProgress, setDeviationsFetchInProgress] = useState(false);
  
  const [additionalTasks, setAdditionalTasks] = useState<any[]>([]);
  const [loadingAdditionalTasks, setLoadingAdditionalTasks] = useState(false);
  const [additionalTasksLastFetch, setAdditionalTasksLastFetch] = useState(0);
  const [additionalTasksFetchInProgress, setAdditionalTasksFetchInProgress] = useState(false);
  
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loadingDrawings, setLoadingDrawings] = useState(false);
  const [drawingsLastFetch, setDrawingsLastFetch] = useState(0);
  const [drawingsFetchInProgress, setDrawingsFetchInProgress] = useState(false);
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeesLastFetch, setEmployeesLastFetch] = useState(0);
  const [employeesFetchInProgress, setEmployeesFetchInProgress] = useState(false);
  
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

  // Enhanced cache check with priority-based refresh
  const shouldRefreshCache = (lastFetchTime: number, cacheStrategy: any) => {
    // If no data has been fetched yet, always fetch
    if (lastFetchTime === 0) return true;
    
    const currentTime = Date.now();
    const timeSinceLastFetch = currentTime - lastFetchTime;
    
    // Different stale times based on data priority
    return timeSinceLastFetch > cacheStrategy.staleTime;
  };

  // Fetch functions with enhanced caching and prioritization
  const fetchProjects = useCallback(async () => {
    // Skip if data is fresh or already fetching
    if (!shouldRefreshCache(projectsLastFetch, CACHE_STRATEGIES.PROJECTS) && projects.length > 0) {
      console.log('Using cached projects data');
      return;
    }

    // Prevent multiple simultaneous fetches
    if (projectsFetchInProgress) {
      console.log('Already fetching projects, skipping duplicate request');
      return;
    }

    try {
      setProjectsFetchInProgress(true);
      setLoadingProjects(projects.length === 0); // Only show loading state if no data yet
      
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_team_members(*), project_stats(*), project_communication_tools(*), project_messages(*)');
      
      if (error) throw error;
      
      setProjects(data || []);
      setProjectsLastFetch(Date.now());
      console.log('Projects data refreshed');
    } catch (error: any) {
      toast.error('Error loading projects', { description: error.message });
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
      setProjectsFetchInProgress(false);
    }
  }, [projects.length, projectsLastFetch, projectsFetchInProgress]);
  
  const fetchDeviations = useCallback(async () => {
    // Similar enhanced fetching logic as fetchProjects
    if (!shouldRefreshCache(deviationsLastFetch, CACHE_STRATEGIES.DEVIATIONS) && deviations.length > 0) {
      console.log('Using cached deviations data');
      return;
    }

    if (deviationsFetchInProgress) {
      console.log('Already fetching deviations, skipping duplicate request');
      return;
    }
    
    try {
      setDeviationsFetchInProgress(true);
      setLoadingDeviations(deviations.length === 0);
      
      const { data, error } = await supabase
        .from('deviations')
        .select('*, deviation_comments(*)');
      
      if (error) throw error;
      
      setDeviations(data || []);
      setDeviationsLastFetch(Date.now());
      console.log('Deviations data refreshed');
    } catch (error: any) {
      toast.error('Error loading deviations', { description: error.message });
      console.error('Error fetching deviations:', error);
    } finally {
      setLoadingDeviations(false);
      setDeviationsFetchInProgress(false);
    }
  }, [deviations.length, deviationsLastFetch, deviationsFetchInProgress]);
  
  const fetchAdditionalTasks = useCallback(async () => {
    // Similar enhanced fetching logic as fetchProjects
    if (!shouldRefreshCache(additionalTasksLastFetch, CACHE_STRATEGIES.ADDITIONAL_TASKS) && additionalTasks.length > 0) {
      console.log('Using cached additional tasks data');
      return;
    }

    if (additionalTasksFetchInProgress) {
      console.log('Already fetching additional tasks, skipping duplicate request');
      return;
    }
    
    try {
      setAdditionalTasksFetchInProgress(true);
      setLoadingAdditionalTasks(additionalTasks.length === 0);
      
      const { data, error } = await supabase
        .from('additional_tasks')
        .select('*');
      
      if (error) throw error;
      
      setAdditionalTasks(data || []);
      setAdditionalTasksLastFetch(Date.now());
      console.log('Additional tasks data refreshed');
    } catch (error: any) {
      toast.error('Error loading additional tasks', { description: error.message });
      console.error('Error fetching additional tasks:', error);
    } finally {
      setLoadingAdditionalTasks(false);
      setAdditionalTasksFetchInProgress(false);
    }
  }, [additionalTasks.length, additionalTasksLastFetch, additionalTasksFetchInProgress]);
  
  const fetchDrawings = useCallback(async () => {
    // Similar enhanced fetching logic as fetchProjects
    if (!shouldRefreshCache(drawingsLastFetch, CACHE_STRATEGIES.DRAWINGS) && drawings.length > 0) {
      console.log('Using cached drawings data');
      return;
    }

    if (drawingsFetchInProgress) {
      console.log('Already fetching drawings, skipping duplicate request');
      return;
    }
    
    try {
      setDrawingsFetchInProgress(true);
      setLoadingDrawings(drawings.length === 0);
      
      const { data, error } = await supabase
        .from('drawings')
        .select('*, drawing_annotation_markers(*)');
      
      if (error) throw error;
      
      setDrawings(data || []);
      setDrawingsLastFetch(Date.now());
      console.log('Drawings data refreshed');
    } catch (error: any) {
      toast.error('Error loading drawings', { description: error.message });
      console.error('Error fetching drawings:', error);
    } finally {
      setLoadingDrawings(false);
      setDrawingsFetchInProgress(false);
    }
  }, [drawings.length, drawingsLastFetch, drawingsFetchInProgress]);
  
  const fetchEmployees = useCallback(async () => {
    // Similar enhanced fetching logic as fetchProjects
    if (!shouldRefreshCache(employeesLastFetch, CACHE_STRATEGIES.EMPLOYEES) && employees.length > 0) {
      console.log('Using cached employees data');
      return;
    }

    if (employeesFetchInProgress) {
      console.log('Already fetching employees, skipping duplicate request');
      return;
    }
    
    try {
      setEmployeesFetchInProgress(true);
      setLoadingEmployees(employees.length === 0);
      
      const { data, error } = await supabase
        .from('employees')
        .select('*, employee_communication_tools(*)');
      
      if (error) throw error;
      
      setEmployees(data || []);
      setEmployeesLastFetch(Date.now());
      console.log('Employees data refreshed');
    } catch (error: any) {
      toast.error('Error loading employees', { description: error.message });
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
      setEmployeesFetchInProgress(false);
    }
  }, [employees.length, employeesLastFetch, employeesFetchInProgress]);

  // Create and update functions with optimistic UI updates
  const createProject = async (projectData: any) => {
    try {
      // Generate a unique project ID with P- prefix if not provided
      const projectId = projectData.project_id || generateEntityId('P');
      
      // Insert the project first
      const { data: projectRecord, error: projectError } = await supabase
        .from('projects')
        .insert({ 
          ...projectData, 
          project_id: projectId,
          is_pinned: projectData.is_pinned || false,
          progress: projectData.progress || 0
        })
        .select()
        .single();
      
      if (projectError) throw projectError;
      
      // Create related project stats
      const { error: statsError } = await supabase
        .from('project_stats')
        .insert({
          project_id: projectRecord.id,
          deviations: 0,
          additions: 0,
          quality_assurance: 0
        });
      
      if (statsError) {
        console.error('Error creating project stats:', statsError);
        // Continue as this is not critical
      }
      
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

  // Intelligent initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      // Fetch high-priority data immediately
      const highPriorityFetches = [];
      
      if (CACHE_STRATEGIES.PROJECTS.prefetch) {
        highPriorityFetches.push(fetchProjects());
      }
      
      if (CACHE_STRATEGIES.DEVIATIONS.prefetch) {
        highPriorityFetches.push(fetchDeviations());
      }
      
      // Load high priority data first
      await Promise.all(highPriorityFetches);
      
      // Then load medium priority data
      if (CACHE_STRATEGIES.ADDITIONAL_TASKS.prefetch) {
        await fetchAdditionalTasks();
      }
      
      // Finally load low priority data with delay to prevent UI blocking
      setTimeout(() => {
        if (CACHE_STRATEGIES.DRAWINGS.prefetch) {
          fetchDrawings();
        }
        
        if (CACHE_STRATEGIES.EMPLOYEES.prefetch) {
          fetchEmployees();
        }
      }, 1000);
    };
    
    loadInitialData();
    
    // Set up a smart refresh interval with staggered timing
    const setupRefreshIntervals = () => {
      // Refresh high priority data more frequently
      const projectsInterval = setInterval(() => {
        if (shouldRefreshCache(projectsLastFetch, CACHE_STRATEGIES.PROJECTS)) {
          console.log('Scheduled projects refresh');
          fetchProjects();
        }
      }, CACHE_STRATEGIES.PROJECTS.staleTime / 2);
      
      const deviationsInterval = setInterval(() => {
        if (shouldRefreshCache(deviationsLastFetch, CACHE_STRATEGIES.DEVIATIONS)) {
          console.log('Scheduled deviations refresh');
          fetchDeviations();
        }
      }, CACHE_STRATEGIES.DEVIATIONS.staleTime / 2);
      
      // Refresh medium and low priority data less frequently
      const tasksInterval = setInterval(() => {
        if (shouldRefreshCache(additionalTasksLastFetch, CACHE_STRATEGIES.ADDITIONAL_TASKS)) {
          console.log('Scheduled tasks refresh');
          fetchAdditionalTasks();
        }
      }, CACHE_STRATEGIES.ADDITIONAL_TASKS.staleTime / 2);
      
      return () => {
        clearInterval(projectsInterval);
        clearInterval(deviationsInterval);
        clearInterval(tasksInterval);
      };
    };
    
    // Start refresh intervals
    const clearIntervals = setupRefreshIntervals();
    return clearIntervals;
  }, [fetchProjects, fetchDeviations, fetchAdditionalTasks, fetchDrawings, fetchEmployees, 
      projectsLastFetch, deviationsLastFetch, additionalTasksLastFetch]);

  // Create memoized context value to prevent unnecessary renders
  const value = useMemo(() => ({
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
  }), [
    projects, loadingProjects, fetchProjects,
    deviations, loadingDeviations, fetchDeviations,
    additionalTasks, loadingAdditionalTasks, fetchAdditionalTasks,
    drawings, loadingDrawings, fetchDrawings,
    employees, loadingEmployees, fetchEmployees,
    theme
  ]);

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
