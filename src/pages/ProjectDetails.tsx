
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building, 
  Building2, 
  Calendar, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  FileText, 
  Home, 
  Users, 
  AlertTriangle, 
  PlusCircle
} from "lucide-react";

// This is a placeholder. In a real app, we would fetch the project data
const getProjectById = (id) => {
  const projects = [
    {
      id: 1,
      projectId: "P-103",
      name: "Projekt Skovvej 12",
      type: "Nybyggeri - Villa",
      category: "bolig",
      status: "igangværende",
      progress: 75,
      team: [
        { initials: "JP", name: "Jens Paulsen", color: "bg-indigo-600", role: "Tømrer" },
        { initials: "BS", name: "Boktogan Saruhan", color: "bg-red-500", role: "Elektriker" },
        { initials: "MN", name: "Mette Nielsen", color: "bg-yellow-500", role: "Ingeniør" },
      ],
      additionalTeamMembers: 3,
      deviations: 12,
      additions: 4,
      qualityAssurance: 85,
      communicationTools: ["meet", "teams", "zoom"],
      startDate: "01-01-2024",
      endDate: "01-08-2024",
      description: "Nybyggeri af villa på Skovvej 12. Projektet omfatter opførelse af en 180 m² villa med 5 værelser, 2 badeværelser, stort køkken-alrum og dobbelt carport.",
      timeline: [
        { date: "01-01-2024", event: "Projekt opstartet", type: "start" },
        { date: "15-01-2024", event: "Fundament støbt", type: "milestone" },
        { date: "01-02-2024", event: "Afvigelse: Manglende materiale", type: "deviation" },
        { date: "15-02-2024", event: "Råhus opført", type: "milestone" },
        { date: "01-03-2024", event: "Tillægsopgave: Ekstra vindue", type: "addition" },
        { date: "15-03-2024", event: "Tag monteret", type: "milestone" },
        { date: "Today", event: "Nu", type: "current" },
        { date: "01-05-2024", event: "Installation af el og VVS", type: "upcoming" },
        { date: "15-06-2024", event: "Færdiggørelse indvendigt", type: "upcoming" },
        { date: "01-08-2024", event: "Aflevering", type: "end" },
      ]
    },
    // More projects would be added here
  ];

  return projects.find(project => project.id === parseInt(id));
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProject = getProjectById(id);
      setProject(foundProject);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header title="Projekt detaljer" userInitials="BL" />
          <div className="p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-gray-300 rounded col-span-1"></div>
                    <div className="h-20 bg-gray-300 rounded col-span-1"></div>
                    <div className="h-20 bg-gray-300 rounded col-span-1"></div>
                  </div>
                  <div className="h-40 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header title="Projekt ikke fundet" userInitials="BL" />
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Projektet kunne ikke findes</h2>
              <p className="mb-6">Projektet med ID {id} findes ikke eller er blevet slettet.</p>
              <Button onClick={() => navigate("/projekter")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tilbage til projekter
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Helper to determine progress bar color
  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-green-600";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Helper to render the category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "bolig":
        return <Home className="h-5 w-5 mr-2" />;
      case "erhverv":
        return <Building className="h-5 w-5 mr-2" />;
      case "institution":
        return <Building2 className="h-5 w-5 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title="Projekt detaljer" userInitials="BL" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-2" 
                onClick={() => navigate("/projekter")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{project.projectId}</span>
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                </div>
                <div className="flex items-center mt-1">
                  {getCategoryIcon(project.category)}
                  <span className="text-gray-600">{project.type}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Dokumenter
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Team
              </Button>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Handling
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center py-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <h4 className="text-lg font-semibold capitalize">{project.status}</h4>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center py-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tidsplan</p>
                  <h4 className="text-lg font-semibold">{project.startDate} - {project.endDate}</h4>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center py-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Afvigelser</p>
                  <h4 className="text-lg font-semibold">{project.deviations}</h4>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center py-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">KS Fremgang</p>
                  <h4 className="text-lg font-semibold">{project.qualityAssurance}%</h4>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Projekt Fremgang</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Samlet fremgang</span>
                  <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                </div>
                <Progress 
                  value={project.progress} 
                  className="h-4"
                  indicatorClassName={getProgressColor(project.progress)}
                />
                <p className="mt-4 text-gray-600">{project.description}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="timeline">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Tidslinje</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="deviations">Afvigelser</TabsTrigger>
              <TabsTrigger value="additions">Tillægsopgaver</TabsTrigger>
              <TabsTrigger value="quality">Kvalitetssikring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Projekt Tidslinje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {/* Timeline events */}
                    <div className="space-y-6 relative">
                      {project.timeline.map((event, index) => {
                        let dotColor = "bg-gray-400";
                        let textColor = "text-gray-600";
                        
                        if (event.type === "current") {
                          dotColor = "bg-blue-500";
                          textColor = "text-blue-700 font-medium";
                        } else if (event.type === "deviation") {
                          dotColor = "bg-red-500";
                          textColor = "text-red-700";
                        } else if (event.type === "addition") {
                          dotColor = "bg-yellow-500";
                          textColor = "text-yellow-700";
                        } else if (event.type === "milestone") {
                          dotColor = "bg-green-500";
                          textColor = "text-green-700";
                        } else if (event.type === "start" || event.type === "end") {
                          dotColor = "bg-indigo-500";
                          textColor = "text-indigo-700 font-medium";
                        }
                        
                        return (
                          <div key={index} className="flex items-start">
                            <div className={`${dotColor} rounded-full h-4 w-4 mt-1 z-10 flex-shrink-0`}></div>
                            <div className="ml-6">
                              <div className="text-sm text-gray-500">{event.date}</div>
                              <div className={`${textColor}`}>{event.event}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Projekt Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.team.map((member, index) => (
                      <div key={index} className="flex items-center p-4 bg-white rounded-lg border">
                        <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center text-white font-bold mr-4`}>
                          {member.initials}
                        </div>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deviations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Afvigelser</CardTitle>
                  <Button onClick={() => navigate(`/afvigelser?project=${project.id}`)}>
                    Se alle afvigelser
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">Klik på 'Se alle afvigelser' for at se projektets afvigelser</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="additions">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tillægsopgaver</CardTitle>
                  <Button onClick={() => navigate(`/tillagsopgaver?project=${project.id}`)}>
                    Se alle tillægsopgaver
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">Klik på 'Se alle tillægsopgaver' for at se projektets tillægsopgaver</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quality">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Kvalitetssikring</CardTitle>
                  <Button onClick={() => navigate(`/kvalitetssikring?project=${project.id}`)}>
                    Se KS-dokumentation
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">Klik på 'Se KS-dokumentation' for at se projektets kvalitetssikring</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
