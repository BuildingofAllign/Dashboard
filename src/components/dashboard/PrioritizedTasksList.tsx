
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, SnowflakeIcon, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock data for prioritized tasks (in a real app, this would come from an API)
const DEMO_PRIORITIZED_TASKS = [
  {
    id: "task-1",
    title: "Update foundation plans for Building A",
    project: "Havneholmen Tower",
    dueDate: "I dag",
    priority: "critical", // critical, high, medium
    status: "pending" // pending, in-progress, delayed
  },
  {
    id: "task-2",
    title: "Review concrete supplier quotes",
    project: "Ørestad College",
    dueDate: "I morgen",
    priority: "high",
    status: "in-progress"
  },
  {
    id: "task-3",
    title: "Schedule site inspection with municipality",
    project: "Amager Strand Apartments",
    dueDate: "Om 2 dage",
    priority: "high",
    status: "delayed"
  },
  {
    id: "task-4",
    title: "Approve electrical subcontractor invoices",
    project: "Nordhavn Office Complex",
    dueDate: "Om 3 dage",
    priority: "medium",
    status: "pending"
  }
];

export const PrioritizedTasksList: React.FC = () => {
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
        <div className="space-y-3">
          {DEMO_PRIORITIZED_TASKS.map((task) => (
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
      </CardContent>
    </Card>
  );
};
