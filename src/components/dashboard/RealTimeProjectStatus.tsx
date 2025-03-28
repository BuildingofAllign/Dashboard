
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectProgressIndicator } from "@/components/ui/ProjectProgressIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, AlertTriangle, Calendar, Users, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";

type ProjectUpdate = {
  id: string;
  name: string;
  status: string;
  progress: number;
  lastUpdate: string;
  updatedBy: string;
  activity: string;
  alert: boolean;
  team: number;
  daysLeft: number;
  project_id: string;
}

export const RealTimeProjectStatus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [refreshTime, setRefreshTime] = useState<string>(new Date().toLocaleTimeString());
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  
  // Update refresh time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date().toLocaleTimeString());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Fetch project updates from Supabase
  useEffect(() => {
    const fetchProjectUpdates = async () => {
      try {
        setLoading(true);
        
        // Fetch project updates with their associated project names
        const { data, error } = await supabase
          .from('project_updates')
          .select(`
            id,
            status,
            progress,
            updated_by,
            activity,
            alert,
            team_size,
            days_left,
            last_update,
            project_id,
            projects(name)
          `);
        
        if (error) {
          throw error;
        }
        
        // Transform the data to match our component's expected format
        const formattedUpdates = data.map(update => ({
          id: update.id,
          name: update.projects?.name || "Unknown Project",
          status: update.status,
          progress: update.progress,
          lastUpdate: formatDistanceToNow(new Date(update.last_update), { 
            addSuffix: true,
            locale: da 
          }),
          updatedBy: update.updated_by,
          activity: update.activity,
          alert: update.alert,
          team: update.team_size,
          daysLeft: update.days_left,
          project_id: update.project_id
        }));
        
        setProjectUpdates(formattedUpdates);
      } catch (error) {
        console.error("Error fetching project updates:", error);
        toast.error("Failed to load project updates");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectUpdates();
    
    // Set up realtime subscription for project updates
    const channel = supabase
      .channel('public:project_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'project_updates' }, 
        (payload) => {
          // Refresh project updates when there's a change
          fetchProjectUpdates();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Toggle expanded project
  const toggleExpandProject = (projectId: string) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };
  
  // Filter projects based on active tab
  const filteredProjects = activeTab === "all" 
    ? projectUpdates 
    : activeTab === "alerts" 
    ? projectUpdates.filter(p => p.alert) 
    : projectUpdates.filter(p => p.status === activeTab);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">
            Real-time projektstatus
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Opdateret: {refreshTime}
          </div>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="aktiv">Aktive</TabsTrigger>
            <TabsTrigger value="ikke-startet">Ikke startet</TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Advarsler
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Building className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-muted-foreground">
                  Ingen projekter at vise for dette filter
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className={cn(
                    "rounded-lg border p-3 transition-all duration-200",
                    project.alert && "border-red-200 dark:border-red-900/30",
                    "hover:shadow-sm cursor-pointer"
                  )}
                  onClick={() => toggleExpandProject(project.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">{project.name}</h3>
                          {project.alert && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{project.team} team medlemmer</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{project.daysLeft} dage tilbage</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "flex items-center gap-1 bg-background",
                          project.activity.toLowerCase().includes("afvigelse") && "text-amber-600 border-amber-200 bg-amber-50/50",
                          project.activity.toLowerCase().includes("tegning") && "text-blue-600 border-blue-200 bg-blue-50/50",
                          project.activity.toLowerCase().includes("ks") && "text-green-600 border-green-200 bg-green-50/50"
                        )}
                      >
                        {project.activity}
                      </Badge>
                    </div>
                    
                    <ProjectProgressIndicator 
                      progress={project.progress} 
                      status={project.status} 
                      size="md"
                      showIcon={false}
                    />
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{project.lastUpdate}</span>
                      </div>
                      <span>Opdateret af: {project.updatedBy}</span>
                    </div>
                    
                    {expandedProjectId === project.id && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <p className="font-medium">
                              {project.status === "aktiv" ? "Aktiv" : 
                               project.status === "ikke-startet" ? "Ikke startet" : 
                               project.status === "afsluttet" ? "Afsluttet" : project.status}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Fremskridt</p>
                            <p className="font-medium">{project.progress}%</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to project details
                              toast.info("Navigation til projektdetaljer");
                            }}
                          >
                            Se detaljer
                          </Button>
                          
                          <Button 
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open project update dialog
                              toast.info("Åbner opdateringsdialog");
                            }}
                          >
                            Opdater
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
