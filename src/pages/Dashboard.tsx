
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  AlertCircle, 
  PlusCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  SunMoon,
  Search,
  Bell
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

// Dummy data for the dashboard
const projectProgress = [
  { name: 'Skovvej 12', progress: 75, id: 1 },
  { name: 'Havnegade 8', progress: 45, id: 2 },
  { name: 'Stationsvej 23', progress: 90, id: 3 },
  { name: 'Bredgade 45', progress: 0, id: 4 },
];

const recentActivity = [
  { type: 'drawing', action: 'Ny tegning uploadet', project: 'Skovvej 12', time: '10 min siden', user: 'MN' },
  { type: 'deviation', action: 'Afvigelse registreret', project: 'Havnegade 8', time: '1 time siden', user: 'BS' },
  { type: 'task', action: 'Tillægsopgave oprettet', project: 'Stationsvej 23', time: '3 timer siden', user: 'JP' },
  { type: 'message', action: 'Ny besked fra kunde', project: 'Skovvej 12', time: '5 timer siden', user: 'KL' },
];

// Project data by type for pie chart
const projectTypeData = [
  { name: 'Bolig', value: 4, color: '#6366F1' },
  { name: 'Erhverv', value: 2, color: '#22C55E' },
  { name: 'Institution', value: 1, color: '#F59E0B' },
  { name: 'Renovering', value: 3, color: '#F43F5E' },
];

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    
    toast({
      title: `${darkMode ? 'Lyst' : 'Mørkt'} tema aktiveret`,
      description: `Du har skiftet til ${darkMode ? 'lyst' : 'mørkt'} tema`,
    });
  };

  // Filter by progress range
  const filterByProgress = (min: number, max: number) => {
    const filtered = projectProgress.filter(project => 
      project.progress >= min && project.progress <= max
    );
    
    toast({
      title: "Projekter filtreret",
      description: `Viser ${filtered.length} projekter mellem ${min}% og ${max}%`,
    });
  };

  // Export dashboard data
  const exportData = () => {
    const dataStr = JSON.stringify(projectProgress);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'dashboard-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data eksporteret",
      description: "Dashboard data er blevet eksporteret som JSON",
    });
  };

  const getProgressColorClass = (progress: number) => {
    if (progress >= 75) return "bg-green-600";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const navigateToProject = (projectId: number) => {
    navigate(`/projekter/${projectId}`);
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title="Dashboard" userInitials="BL" />

        <div className="p-6">
          {/* Top Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Input 
                className="max-w-[300px]" 
                placeholder="Søg i dashboard..." 
                prefix={<Search className="h-4 w-4" />}
              />
              <Button variant="outline" onClick={() => filterByProgress(0, 25)}>0-25%</Button>
              <Button variant="outline" onClick={() => filterByProgress(26, 50)}>26-50%</Button>
              <Button variant="outline" onClick={() => filterByProgress(51, 75)}>51-75%</Button>
              <Button variant="outline" onClick={() => filterByProgress(76, 100)}>76-100%</Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                      <SunMoon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Skift tema</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={exportData}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eksporter data</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Bell className="h-4 w-4" />
                      <span className="absolute h-2 w-2 top-1 right-1 bg-red-500 rounded-full"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifikationer</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center py-6">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Aktive projekter</p>
                        <h4 className="text-2xl font-bold">4</h4>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium">Aktive projekter</p>
                  <p className="text-sm text-gray-500">Projekter som er i gang og har aktive opgaver.</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center py-6">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Medarbejdere</p>
                        <h4 className="text-2xl font-bold">12</h4>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium">Tilknyttede medarbejdere</p>
                  <p className="text-sm text-gray-500">Totale antal af aktive medarbejdere på alle projekter.</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center py-6">
                      <div className="bg-indigo-100 p-3 rounded-full mr-4">
                        <FileText className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tegninger</p>
                        <h4 className="text-2xl font-bold">28</h4>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium">Registrerede tegninger</p>
                  <p className="text-sm text-gray-500">Totale antal af uploadede tegninger på tværs af alle projekter.</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center py-6">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Afvigelser</p>
                        <h4 className="text-2xl font-bold">15</h4>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium">Registrerede afvigelser</p>
                  <p className="text-sm text-gray-500">Totale antal af afvigelser som kræver opmærksomhed.</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Project Progress Chart */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Projekt Fremgang</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === 'bar' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className="h-8"
                  >
                    Søjler
                  </Button>
                  <Button 
                    variant={chartType === 'pie' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType('pie')}
                    className="h-8"
                  >
                    Cirkel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart
                        data={projectProgress}
                        margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Fremgang']}
                          labelFormatter={(name) => `Projekt: ${name}`}
                        />
                        <Bar 
                          dataKey="progress" 
                          fill="#6366F1" 
                          className="cursor-pointer"
                          onClick={(data) => navigateToProject(data.id)}
                        />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={projectTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          className="cursor-pointer"
                        >
                          {projectTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Seneste Aktivitet</span>
                  <Button variant="outline" size="sm">Se alle</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mr-4 mt-1">
                        {activity.type === 'drawing' && <FileText className="h-5 w-5 text-indigo-500" />}
                        {activity.type === 'deviation' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                        {activity.type === 'task' && <PlusCircle className="h-5 w-5 text-green-500" />}
                        {activity.type === 'message' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.project}</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-medium">
                          {activity.user}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Projects */}
            <Card className="col-span-2 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Aktive Projekter</span>
                  <Button variant="outline" size="sm" onClick={() => navigate('/projekter')}>Se alle</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectProgress.slice(0, 3).map((project, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigateToProject(project.id)}
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <span className="text-sm text-gray-500">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColorClass(project.progress)}`} 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="text-xs h-7">Detaljer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Team</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-xs h-7">Sorter</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7">Filter</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                            JP
                          </div>
                          <div>
                            <p className="font-medium">Jens Paulsen</p>
                            <p className="text-sm text-gray-500">Tømrer</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div>
                          <p className="font-bold">Jens Paulsen</p>
                          <p className="text-sm">4 aktive projekter</p>
                          <p className="text-sm">Specialiseret i træarbejde</p>
                        </div>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mr-3">
                            BS
                          </div>
                          <div>
                            <p className="font-medium">Boktogan Saruhan</p>
                            <p className="text-sm text-gray-500">Elektriker</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div>
                          <p className="font-bold">Boktogan Saruhan</p>
                          <p className="text-sm">3 aktive projekter</p>
                          <p className="text-sm">Certificeret elektriker</p>
                        </div>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold mr-3">
                            MN
                          </div>
                          <div>
                            <p className="font-medium">Mette Nielsen</p>
                            <p className="text-sm text-gray-500">Ingeniør</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div>
                          <p className="font-bold">Mette Nielsen</p>
                          <p className="text-sm">5 aktive projekter</p>
                          <p className="text-sm">Konstruktionsingeniør</p>
                        </div>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  
                  <Button variant="outline" className="w-full">Vis alle medlemmer</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
