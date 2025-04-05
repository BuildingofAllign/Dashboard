
import React, { useState, useEffect } from "react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectsHeader } from "@/components/projects/ProjectsHeader";
import { ProjectsContent } from "@/components/projects/ProjectsContent";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ViewMode } from "@/components/ui/ViewToggle";
import { toast } from "sonner";
import { ProjectSummaryCard } from "@/components/ui/ProjectSummaryCard";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { ProjectHoverCard } from "@/components/ui/ProjectHoverCard";
import { ProjectSkeleton } from "@/components/ui/ProjectSkeleton";
import { Header } from "@/components/layout/Header";
import { DanishProjectList } from "@/components/projects/DanishProjectList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Projects = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(
    localStorage.getItem('projectViewMode') as ViewMode || 'grid'
  );
  const [activeTab, setActiveTab] = useState("standard");
  
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredAndSortedProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleTogglePin,
    loadingProjects,
    error,
    getProjectsByCategory
  } = useProjects();
  
  useEffect(() => {
    localStorage.setItem('projectViewMode', viewMode);
  }, [viewMode]);
  
  const handleEditProject = (project: any) => {
    toast.info(`Redigerer projekt: ${project.name}`);
  };
  
  const handlePinWithToast = (projectId: string, isPinned: boolean) => {
    handleTogglePin(projectId, isPinned);
    toast.success(isPinned ? "Projekt fjernet fra favoritter" : "Projekt tilføjet til favoritter", {
      description: isPinned 
        ? "Projektet vil ikke længere være fastgjort til toppen" 
        : "Projektet vil nu være fastgjort til toppen af listen",
      duration: 3000,
    });
  };
  
  const pinnedProjects = filteredAndSortedProjects.filter(p => p.is_pinned || p.isPinned);
  const projectsByType = filteredAndSortedProjects.reduce((acc, project) => {
    if (project.is_pinned || project.isPinned) return acc;
    
    const type = project.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(project);
    return acc;
  }, {} as Record<string, typeof filteredAndSortedProjects>);
  
  const sortedTypes = Object.keys(projectsByType).sort();

  if (error) {
    return (
      <>
        <Header title="Projekter" userInitials="BL" />
        <div className="container py-6 max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fejl ved indlæsning af projekter</AlertTitle>
            <AlertDescription>
              Der opstod en fejl ved indlæsning af projekter. Prøv at genindlæse siden.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Projekter" userInitials="BL" />
      <div className="container py-6 space-y-6 max-w-7xl mx-auto">
        <ProjectsHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          filteredAndSortedProjects={filteredAndSortedProjects}
          setCommandOpen={setIsCommandOpen}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="standard" className="flex-1">Standard visning</TabsTrigger>
            <TabsTrigger value="danish" className="flex-1">Dansk visning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="space-y-8 mt-4">
            {viewMode !== "list" && pinnedProjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Fastgjorte projekter</h2>
                  <Badge variant="secondary" className="rounded-full">
                    {pinnedProjects.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {pinnedProjects.map(project => (
                    <ProjectSummaryCard
                      key={`pinned-${project.id}`}
                      project={project}
                      className="border-primary/30 shadow-md"
                    />
                  ))}
                </div>
                
                <Separator className="my-6" />
              </div>
            )}
            
            {viewMode === "list" ? (
              <ProjectsContent 
                viewMode={viewMode}
                loadingProjects={loadingProjects}
                filteredAndSortedProjects={filteredAndSortedProjects}
                handlePinWithToast={handlePinWithToast}
                handleEditProject={handleEditProject}
                handleDeleteProject={handleDeleteProject}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
              />
            ) : (
              loadingProjects ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  <ProjectSkeleton count={8} />
                </div>
              ) : filteredAndSortedProjects.length === 0 ? (
                <EmptyState
                  title="Ingen projekter fundet"
                  description="Prøv at justere dine filtre eller opret et nyt projekt."
                  icon="file"
                  actionLabel="Opret nyt projekt"
                  onAction={() => setIsCreateDialogOpen(true)}
                />
              ) : (
                <div className="space-y-10">
                  {sortedTypes.map(type => (
                    <div key={type} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold capitalize">{type}</h2>
                        <Badge variant="outline" className="rounded-full">
                          {projectsByType[type].length}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                        {projectsByType[type].map(project => (
                          <ProjectHoverCard key={project.id} project={project}>
                            <div className="h-full">
                              <ProjectSummaryCard project={project} />
                            </div>
                          </ProjectHoverCard>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="danish">
            {loadingProjects ? (
              <div className="space-y-4">
                <div className="h-32 bg-muted animate-pulse rounded-md"></div>
                <div className="h-32 bg-muted animate-pulse rounded-md"></div>
                <div className="h-32 bg-muted animate-pulse rounded-md"></div>
              </div>
            ) : filteredAndSortedProjects.length === 0 ? (
              <EmptyState
                title="Ingen projekter fundet"
                description="Prøv at justere dine filtre eller opret et nyt projekt."
                icon="file"
                actionLabel="Opret nyt projekt"
                onAction={() => setIsCreateDialogOpen(true)}
              />
            ) : (
              <DanishProjectList projects={filteredAndSortedProjects} />
            )}
          </TabsContent>
        </Tabs>
        
        <ProjectFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          mode="create"
          onSubmit={handleCreateProject}
        />
        
        <CommandPalette
          open={isCommandOpen}
          onOpenChange={setIsCommandOpen}
        />
        
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Projects;
