
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProjectProgressIndicator } from "@/components/ui/ProjectProgressIndicator";
import { Users, Calendar, AlertTriangle, Building, ChevronRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

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

// Sample demo data to use when no data is available from the database
const DEMO_PROJECTS = [
  {
    id: "demo-1",
    project_id: "demo-proj-1",
    status: "aktiv",
    progress: 75,
    updated_by: "Anders Jensen",
    activity: "Opdaterede tegninger",
    alert: false,
    team_size: 4,
    days_left: 14,
    project_name: "Boligbyggeri Nord"
  },
  {
    id: "demo-2",
    project_id: "demo-proj-2",
    status: "problem",
    progress: 45,
    updated_by: "Mette Nielsen",
    activity: "Rapporterede materialeproblemer",
    alert: true,
    team_size: 3,
    days_left: 5,
    project_name: "Erhvervsrenovering Centrum"
  }
];

export const RealTimeProjectStatus: React.FC<RealTimeProjectStatusProps> = ({ 
  className 
}) => {
  const [projects, setProjects] = useState<ProjectUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    const fetchProjectUpdates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add timeout to prevent indefinite loading
        const timeoutId = setTimeout(() => {
          console.log("Project updates fetch timeout - using demo data");
          setUseDemo(true);
          setProjects(DEMO_PROJECTS);
          setIsLoading(false);
        }, 5000);
        
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
          .limit(expanded ? 8 : 4);
          
        // Clear timeout since we got a response
        clearTimeout(timeoutId);

        if (error) {
          console.error("Error fetching project updates:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log("No project updates found, using demo data");
          setUseDemo(true);
          setProjects(DEMO_PROJECTS);
        } else {
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
          setUseDemo(false);
        }
      } catch (err) {
        console.error("Error fetching project updates:", err);
        setError("Kunne ikke hente projekt opdateringer. Viser demo data.");
        setUseDemo(true);
        setProjects(DEMO_PROJECTS);
        toast.error("Kunne ikke hente projekt opdateringer");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectUpdates();

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
            table: 'project_updates'
          },
          () => {
            fetchProjectUpdates();
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error("Error subscribing to project updates");
          }
        });
    } catch (err) {
      console.error("Error setting up realtime subscription:", err);
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [expanded]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktiv':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Aktiv</Badge>;
      case 'problem':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Problem</Badge>;
      case 'standset':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Standset</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  return (
    <Card className={cn("h-full overflow-hidden flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Realtime projekt status</CardTitle>
          {useDemo && <Badge variant="outline" className="ml-2 text-xs">Demo data</Badge>}
        </div>
        <Button variant="outline" size="sm" className="h-8" onClick={() => {
          toast.info("Viser alle projekter");
        }}>
          Alle projekter
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pb-0">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Indlæser projekter..." />
          </div>
        ) : error && !useDemo ? (
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
              <div key={project.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                      {project.alert && (
                        <div className="p-1 bg-red-50 text-red-500 rounded-full">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mt-1">
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
                  <div className="flex space-x-1">
                    {project.status === 'aktiv' && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Start
                      </Badge>
                    )}
                    {project.status === 'problem' && (
                      <Badge className="bg-red-500 hover:bg-red-600">
                        Kritisk
                      </Badge>
                    )}
                    {project.status === 'standset' && (
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        Høj
                      </Badge>
                    )}
                  </div>
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
      <CardFooter className="flex justify-between items-center pt-4 pb-4 border-t mt-4">
        <span className="text-sm text-muted-foreground">
          {projects.length} projekter vist
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
