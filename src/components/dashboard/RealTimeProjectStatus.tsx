
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectProgressIndicator } from "@/components/ui/ProjectProgressIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, AlertTriangle, Calendar, Users, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for real-time project updates
const DEMO_PROJECTS = [
  {
    id: "proj-1",
    name: "Havneholmen Tower",
    status: "aktiv",
    progress: 37,
    lastUpdate: "For 2 minutter siden",
    updatedBy: "Anders Jensen",
    activity: "Afvigelse tilføjet",
    alert: true,
    team: 8,
    daysLeft: 43
  },
  {
    id: "proj-2",
    name: "Ørestad College",
    status: "aktiv",
    progress: 62,
    lastUpdate: "For 15 minutter siden",
    updatedBy: "Mette Nielsen",
    activity: "Tegning uploaded",
    alert: false,
    team: 5,
    daysLeft: 18
  },
  {
    id: "proj-3",
    name: "Amager Strand Apartments",
    status: "aktiv",
    progress: 85,
    lastUpdate: "For 1 time siden",
    updatedBy: "Lars Petersen",
    activity: "KS opdateret",
    alert: false,
    team: 12,
    daysLeft: 7
  },
  {
    id: "proj-4",
    name: "Nordhavn Office Complex",
    status: "ikke-startet",
    progress: 0,
    lastUpdate: "For 3 timer siden",
    updatedBy: "Sofie Hansen",
    activity: "Projekt oprettet",
    alert: false,
    team: 0,
    daysLeft: 120
  }
];

export const RealTimeProjectStatus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [refreshTime, setRefreshTime] = useState<string>(new Date().toLocaleTimeString());
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date().toLocaleTimeString());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const filteredProjects = activeTab === "all" 
    ? DEMO_PROJECTS 
    : activeTab === "alerts" 
    ? DEMO_PROJECTS.filter(p => p.alert) 
    : DEMO_PROJECTS.filter(p => p.status === activeTab);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">
            Real-time projektstatus
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Opdateret: {refreshTime}
          </div>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
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
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Ingen projekter at vise for dette filter
            </p>
          ) : (
            filteredProjects.map((project) => (
              <div 
                key={project.id}
                className={cn(
                  "space-y-3 rounded-lg border p-3",
                  project.alert && "border-red-200 dark:border-red-900/30"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">{project.name}</h3>
                      {project.alert && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
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
                    className="flex items-center gap-1 bg-background"
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
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
