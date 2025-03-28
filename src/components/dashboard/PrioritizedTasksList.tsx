
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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

export const PrioritizedTasksList: React.FC<PrioritizedTasksListProps> = ({ 
  className 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            priority,
            due_date,
            status,
            projects(name)
          `)
          .order('priority', { ascending: false })
          .limit(4);

        if (error) throw error;

        const formattedData = data.map(task => ({
          id: task.id,
          title: task.title,
          priority: task.priority as 'critical' | 'high' | 'medium',
          due_date: task.due_date,
          status: task.status,
          project_name: task.projects?.name
        }));

        setTasks(formattedData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Kunne ikke hente opgaver');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    // Subscribe to changes
    const channel = supabase
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Prioriterede opgaver</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
