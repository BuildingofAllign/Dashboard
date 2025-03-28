
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, SnowflakeIcon, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format, isToday, isTomorrow, parseISO, addDays } from "date-fns";
import { da } from "date-fns/locale";

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
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Format due date for display
  const formatDueDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      
      if (isToday(date)) {
        return "I dag";
      } else if (isTomorrow(date)) {
        return "I morgen";
      } else if (isTomorrow(addDays(date, -1))) {
        return "Om 2 dage";
      } else {
        return format(date, "d. MMM", { locale: da });
      }
    } catch (error) {
      // If it's not a valid ISO date, return as is (for hardcoded values like "I dag")
      return dateStr;
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "delayed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

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

  // Function to handle task status update
  const handleStartTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'in-progress' })
        .eq('id', taskId);
      
      if (error) throw error;
      
      toast.success("Opgave startet");
      
      // Update the local state to reflect the change
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'in-progress' as const } 
          : task
      ));
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Kunne ikke starte opgaven");
    }
  };

  // Function to toggle task expansion
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <Card className="h-full">
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
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-muted-foreground">
              Ingen prioriterede opgaver at vise
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "rounded-lg border p-3 transition-all duration-200",
                  task.priority === "critical" && "border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10",
                  task.priority === "high" && "border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10",
                  task.priority === "medium" && "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10",
                  "hover:shadow-sm cursor-pointer"
                )}
                onClick={() => toggleTaskExpansion(task.id)}
              >
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <p className={cn(
                          "font-medium",
                          task.status === "completed" && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{task.project}</span>
                        <span className="text-xs">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDueDate(task.dueDate)}</span>
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
                    </div>
                  </div>
                  
                  {expandedTaskId === task.id && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="font-medium">
                            {task.status === "pending" ? "Afventer" : 
                             task.status === "in-progress" ? "Igangværende" : 
                             task.status === "delayed" ? "Forsinket" : "Afsluttet"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Prioritet</p>
                          <p className="font-medium">
                            {task.priority === "critical" ? "Kritisk" : 
                             task.priority === "high" ? "Høj" : "Medium"}
                          </p>
                        </div>
                      </div>
                      
                      {task.status !== "completed" && (
                        <Button 
                          size="sm" 
                          className="w-full"
                          variant={task.status === "in-progress" ? "secondary" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTask(task.id);
                          }}
                        >
                          {task.status === "in-progress" ? "Arbejder på opgave" : "Start opgave"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
