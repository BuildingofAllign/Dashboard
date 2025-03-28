
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, SnowflakeIcon, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type Task = {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  priority: "critical" | "high" | "medium";
  status: "pending" | "in-progress" | "delayed" | "completed";
}

export const PrioritizedTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks with their associated project names
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            due_date,
            priority,
            status,
            projects(name)
          `)
          .order('priority', { ascending: false })
          .limit(5);
        
        if (error) {
          throw error;
        }
        
        // Transform the data to match our component's expected format
        const formattedTasks = data.map(task => ({
          id: task.id,
          title: task.title,
          project: task.projects?.name || "Unknown Project",
          dueDate: task.due_date,
          priority: task.priority as "critical" | "high" | "medium",
          status: task.status as "pending" | "in-progress" | "delayed" | "completed"
        }));
        
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
    
    // Set up realtime subscription for tasks
    const channel = supabase
      .channel('public:tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        (payload) => {
          // Refresh tasks when there's a change
          fetchTasks();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          Prioriterede opgaver
        </CardTitle>
        <div className="flex items-center gap-1">
          <SnowflakeIcon className="h-4 w-4 text-blue-500" />
          <span className="text-xs text-muted-foreground">Snowplow model</span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="md" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Ingen prioriterede opgaver at vise
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "flex items-start justify-between rounded-lg border p-3",
                  task.priority === "critical" && "border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10",
                  task.priority === "high" && "border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10",
                  task.priority === "medium" && "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10"
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {task.status === "delayed" && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <p className="font-medium">{task.title}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{task.project}</span>
                    <span className="text-xs">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      task.priority === "critical" ? "destructive" : 
                      task.priority === "high" ? "default" : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    {task.priority === "critical" && <ArrowUp className="h-3 w-3" />}
                    {task.priority === "critical" ? "Kritisk" : 
                     task.priority === "high" ? "Høj" : "Medium"}
                  </Badge>
                  <Button size="sm" className="h-7 px-2">
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
