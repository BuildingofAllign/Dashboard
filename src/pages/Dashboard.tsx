
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreadcrumbNav } from "@/components/ui/BreadcrumbNav";
import { BarChart, LineChart, PieChart, DonutChart } from "@/components/ui/charts";
import { useTheme } from "@/hooks/use-theme";
import { Building, Building2, Home, User, Clock, CheckCircle, AlertTriangle, PlusCircle, TrendingUp, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useData } from "@/context/DataContext";

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { projects, deviations, additionalTasks, loadingProjects, loadingDeviations, loadingAdditionalTasks } = useData();
  const chartTheme = isDarkMode ? "dark" : "light";
  
  // Derived data for charts
  const [projectsByCategory, setProjectsByCategory] = useState<any[]>([]);
  const [projectProgress, setProjectProgress] = useState<any[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<any[]>([]);
  const [qualityAssurance, setQualityAssurance] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    openDeviations: 0,
    qualityAssurancePercent: 0,
    additionalTasksCount: 0,
    projectsIncrease: 0,
    deviationsIncrease: 0,
    qaIncrease: 0,
    additionalTasksDecrease: 0
  });

  useEffect(() => {
    if (!loadingProjects && projects.length > 0) {
      // Process projects by category
      const categoryMap: Record<string, number> = {};
      projects.forEach(project => {
        if (project.category) {
          categoryMap[project.category] = (categoryMap[project.category] || 0) + 1;
        }
      });
      
      const projectsByCategoryData = Object.entries(categoryMap).map(([name, count]) => ({
        name,
        count
      }));
      setProjectsByCategory(projectsByCategoryData);
      
      // Process projects by status
      const statusMap: Record<string, number> = {};
      projects.forEach(project => {
        if (project.status) {
          statusMap[project.status] = (statusMap[project.status] || 0) + 1;
        }
      });
      
      const projectStatusesData = Object.entries(statusMap).map(([name, count]) => ({
        name,
        count
      }));
      setProjectStatuses(projectStatusesData);
      
      // Set active projects count
      const activeProjectsCount = projects.filter(p => p.status === 'Igangværende').length;
      setStats(prev => ({
        ...prev,
        activeProjects: activeProjectsCount,
        projectsIncrease: 8 // Mock data, could be calculated from historical data
      }));
    }
  }, [loadingProjects, projects]);
  
  useEffect(() => {
    if (!loadingDeviations && deviations.length > 0) {
      // Set open deviations count
      const openDeviationsCount = deviations.filter(d => d.status !== 'Lukket' && d.status !== 'Godkendt').length;
      setStats(prev => ({
        ...prev,
        openDeviations: openDeviationsCount,
        deviationsIncrease: 12 // Mock data, could be calculated from historical data
      }));
      
      // Mock data for monthly progress
      // In a real application, this would come from actual historical data
      setProjectProgress([
        { month: "Jan", afvigelser: 5, tillægsopgaver: 2 },
        { month: "Feb", afvigelser: 8, tillægsopgaver: 3 },
        { month: "Mar", afvigelser: 12, tillægsopgaver: 5 },
        { month: "Apr", afvigelser: 7, tillægsopgaver: 8 },
        { month: "Maj", afvigelser: 15, tillægsopgaver: 10 },
        { month: "Jun", afvigelser: 10, tillægsopgaver: 7 },
      ]);
      
      // Mock data for quality assurance
      // In a real application, this would be calculated from actual data
      setQualityAssurance([
        { name: "Godkendt", percentage: 65 },
        { name: "Afventer", percentage: 25 },
        { name: "Fejl", percentage: 10 },
      ]);
      
      setStats(prev => ({
        ...prev,
        qualityAssurancePercent: 65,
        qaIncrease: 5 // Mock data, could be calculated from historical data
      }));
    }
  }, [loadingDeviations, deviations]);
  
  useEffect(() => {
    if (!loadingAdditionalTasks && additionalTasks.length > 0) {
      setStats(prev => ({
        ...prev,
        additionalTasksCount: additionalTasks.length,
        additionalTasksDecrease: 3 // Mock data, could be calculated from historical data
      }));
    }
  }, [loadingAdditionalTasks, additionalTasks]);
  
  // Get current date in Danish format
  const currentDate = new Date().toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Capitalize first letter of the date
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "boliger":
        return <Home className="h-4 w-4" />;
      case "erhverv":
        return <Building className="h-4 w-4" />;
      case "institutioner":
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  // Bread crumb items
  const breadcrumbItems = [
    { label: "Dashboard" }
  ];

  // Loading state handling
  if (loadingProjects || loadingDeviations || loadingAdditionalTasks) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Dashboard" userInitials="BL" />
          <div className="p-6 overflow-auto">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Indlæser data...</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Et øjeblik...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" userInitials="BL" />
        
        <div className="p-6 overflow-auto">
          <BreadcrumbNav items={breadcrumbItems} className="mb-4" />
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Velkommen til dashboardet</h2>
            <p className="text-gray-600 dark:text-gray-400">{formattedDate}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aktive projekter</p>
                  <h4 className="text-2xl font-bold">{stats.activeProjects}</h4>
                  <div className="flex items-center mt-1 text-sm text-green-600 dark:text-green-400">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{stats.projectsIncrease}% siden sidst</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Åbne afvigelser</p>
                  <h4 className="text-2xl font-bold">{stats.openDeviations}</h4>
                  <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{stats.deviationsIncrease}% siden sidst</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">KS godkendt</p>
                  <h4 className="text-2xl font-bold">{stats.qualityAssurancePercent}%</h4>
                  <div className="flex items-center mt-1 text-sm text-green-600 dark:text-green-400">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{stats.qaIncrease}% siden sidst</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full mr-4">
                  <PlusCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tillægsopgaver</p>
                  <h4 className="text-2xl font-bold">{stats.additionalTasksCount}</h4>
                  <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{stats.additionalTasksDecrease}% siden sidst</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Oversigt</TabsTrigger>
              <TabsTrigger value="projects">Projekter</TabsTrigger>
              <TabsTrigger value="quality">Kvalitetssikring</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projekter efter kategori</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart 
                      data={projectsByCategory} 
                      index="name" 
                      categories={["count"]} 
                      valueFormatter={(value) => `${value} projekter`}
                      className="h-80"
                      theme={chartTheme}
                      showAnimation={true}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {projectsByCategory.map((category) => (
                        <div key={category.name} className="flex items-center">
                          {getCategoryIcon(category.name)}
                          <span className="ml-2 text-sm">{category.name} ({category.count})</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Afvigelser og tillægsopgaver</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart 
                      data={projectProgress} 
                      index="month"
                      categories={["afvigelser", "tillægsopgaver"]}
                      stack={true}
                      className="h-80"
                      theme={chartTheme}
                      showAnimation={true}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projekt status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DonutChart
                      data={projectStatuses}
                      index="name"
                      categories={["count"]}
                      valueFormatter={(value) => `${value} projekter`}
                      className="h-60"
                      theme={chartTheme}
                      showAnimation={true}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Kvalitetssikring status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DonutChart
                      data={qualityAssurance}
                      index="name"
                      categories={["percentage"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-60"
                      theme={chartTheme}
                      showAnimation={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Projekt oversigt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-gray-500 dark:text-gray-400">Denne visning er under udvikling.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quality" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Kvalitetssikring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-gray-500 dark:text-gray-400">Denne visning er under udvikling.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-gray-500 dark:text-gray-400">Denne visning er under udvikling.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
