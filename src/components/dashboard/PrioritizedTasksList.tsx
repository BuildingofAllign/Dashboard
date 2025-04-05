
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Calendar, Clock, AlertCircle, ChevronRight, Filter } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium';
  due_date: string;
  status: string;
  project_name?: string;
}

interface PrioritizedTasksListProps {
  className?: string;
}

// Sample demo data to use when no data is available from the database
const DEMO_TASKS = [
  {
    id: "demo-1",
    title: "Opdater tegning for nordvæg",
    priority: "critical" as 'critical',
    due_date: "I dag, 16:00",
    status: "delayed",
    project_name: "Boligbyggeri Nord"
  },
  {
    id: "demo-2",
    title: "Materiale godkendelse",
    priority: "high" as 'high',
    due_date: "I morgen, 12:00",
    status: "in-progress",
    project_name: "Erhvervsrenovering Centrum"
  },
  {
    id: "demo-3",
    title: "KS inspektion",
    priority: "medium" as 'medium',
    due_date: "3. maj",
    status: "pending",
    project_name: "Institutionsbyggeri Syd"
  }
];

export const PrioritizedTasksList: React.FC<PrioritizedTasksListProps> = ({ 
  className 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high'>('all');
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add timeout to prevent indefinite loading
        const timeoutId = setTimeout(() => {
          console.log("Tasks fetch timeout - using demo data");
          setUseDemo(true);
          setTasks(DEMO_TASKS);
          setIsLoading(false);
        }, 5000);
        
        let query = supabase
          .from('tasks')
          .select(`
            id,
            title,
            priority,
            due_date,
            status,
            projects(name)
          `)
          .order('priority', { ascending: false });
          
        if (filter !== 'all') {
          query = query.eq('priority', filter);
        }

        const { data, error } = await query.limit(expanded ? 8 : 4);
        
        // Clear timeout since we got a response
        clearTimeout(timeoutId);

        if (error) {
          console.error("Error fetching tasks:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log("No tasks found, using demo data");
          setUseDemo(true);
          setTasks(DEMO_TASKS);
        } else {
          const formattedData = data.map(task => ({
            id: task.id,
            title: task.title,
            priority: task.priority as 'critical' | 'high' | 'medium',
            due_date: task.due_date,
            status: task.status,
            project_name: task.projects?.name
          }));

          setTasks(formattedData);
          setUseDemo(false);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Kunne ikke hente opgaver. Viser demo data.');
        setUseDemo(true);
        setTasks(DEMO_TASKS);
        toast.error("Kunne ikke hente opgaver");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    // Limited subscription to changes - with error handling
    let channel;
    try {
      channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks'
          },
          () => {
            fetchTasks();
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error("Error subscribing to tasks");
          }
        });
    } catch (err) {
      console.error("Error setting up realtime subscription:", err);
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [expanded, filter]);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleMarkAsComplete = (taskId: string) => {
    toast.success("Opgave markeret som fuldført");
    // Here we would update the task status in the database
  };

  return (
    <Card className={cn("h-full overflow-hidden flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Prioriterede opgaver</CardTitle>
        <div className="flex gap-2 items-center">
          {useDemo && <Badge variant="outline" className="text-xs">Demo data</Badge>}
          <div className="flex items-center bg-secondary text-xs rounded-md overflow-hidden">
            <button 
              className={cn(
                "px-2 py-1 transition-colors",
                filter === 'all' ? "bg-primary text-primary-foreground" : "hover:bg-secondary-foreground/10"
              )}
              onClick={() => setFilter('all')}
            >
              Alle
            </button>
            <button 
              className={cn(
                "px-2 py-1 transition-colors",
                filter === 'critical' ? "bg-primary text-primary-foreground" : "hover:bg-secondary-foreground/10"
              )}
              onClick={() => setFilter('critical')}
            >
              Kritiske
            </button>
            <button 
              className={cn(
                "px-2 py-1 transition-colors",
                filter === 'high' ? "bg-primary text-primary-foreground" : "hover:bg-secondary-foreground/10"
              )}
              onClick={() => setFilter('high')}
            >
              Høj
            </button>
          </div>
          <Button variant="outline" size="icon" className="h-6 w-6">
            <Filter className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pb-0">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Indlæser opgaver..." />
          </div>
        ) : error && !useDemo ? (
          <div className="text-center py-8 text-muted-foreground">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Ingen prioriterede opgaver
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-lg flex flex-col gap-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{task.title}</h3>
                  <Badge variant="outline" className={getPriorityStyles(task.priority)}>
                    {task.priority === 'critical' ? 'Kritisk' : 
                     task.priority === 'high' ? 'Høj' : 'Medium'}
                  </Badge>
                </div>
                
                {task.project_name && (
                  <div className="text-sm text-muted-foreground">
                    {task.project_name}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-1 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{task.due_date}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(task.status)}
                    <span className={task.status === 'delayed' ? 'text-red-500' : ''}>
                      {task.status === 'pending' ? 'Afventer' : 
                       task.status === 'in-progress' ? 'I gang' : 
                       task.status === 'delayed' ? 'Forsinket' : 'Færdig'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end mt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => handleMarkAsComplete(task.id)}
                  >
                    Markér som fuldført
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 pb-4 border-t mt-4">
        <span className="text-sm text-muted-foreground">
          {tasks.length} opgaver vist
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-primary"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Vis færre' : 'Vis flere'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
