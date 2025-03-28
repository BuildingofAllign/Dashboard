
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProjectProgressIndicator } from "@/components/ui/ProjectProgressIndicator";
import { Users, Calendar, AlertTriangle } from "lucide-react";

interface ProjectUpdate {
  id: string;
  project_id: string;
  status: string;
  progress: number;
  updated_by: string;
  activity: string;
  alert: boolean;
  team_size: number;
  days_left: number;
  project_name?: string;
}

interface RealTimeProjectStatusProps {
  className?: string;
}

export const RealTimeProjectStatus: React.FC<RealTimeProjectStatusProps> = ({ 
  className 
}) => {
  const [projects, setProjects] = useState<ProjectUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('project_updates')
          .select(`
            id,
            project_id,
            status,
            progress,
            updated_by,
            activity,
            alert,
            team_size,
            days_left,
            projects(name)
          `)
          .order('last_update', { ascending: false })
          .limit(4);

        if (error) throw error;

        const formattedData = data.map(update => ({
          id: update.id,
          project_id: update.project_id,
          status: update.status,
          progress: update.progress,
          updated_by: update.updated_by,
          activity: update.activity,
          alert: update.alert,
          team_size: update.team_size,
          days_left: update.days_left,
          project_name: update.projects?.name
        }));

        setProjects(formattedData);
      } catch (err) {
        console.error('Error fetching project updates:', err);
        setError('Kunne ikke hente projekt opdateringer');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectUpdates();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_updates'
        },
        () => {
          fetchProjectUpdates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Realtime projekt status</CardTitle>
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
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Ingen projekt opdateringer
          </div>
        ) : (
          <div className="space-y-5">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {project.project_name || 'Unavngivet projekt'}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 mr-4">
                        <Users className="h-4 w-4" />
                        {project.team_size} medlemmer
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {project.days_left} dage tilbage
                      </span>
                    </div>
                  </div>
                  {project.alert && (
                    <div className="p-1.5 bg-red-50 text-red-500 rounded-full">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                <ProjectProgressIndicator 
                  progress={project.progress} 
                  status={project.status as any}
                  size="md"
                  showLabel
                  animate
                  className="mb-3"
                />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(project.updated_by)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{project.activity}</span>
                  </div>
                  
                  <span className="text-muted-foreground">af {project.updated_by}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
