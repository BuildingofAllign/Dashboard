
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreadcrumbNav } from "@/components/ui/BreadcrumbNav";
import { BarChart, LineChart, PieChart, DonutChart } from "@/components/ui/charts";
import { useTheme } from "@/hooks/use-theme";
import { 
  Building, Building2, Home, User, Clock, CheckCircle, AlertTriangle, 
  PlusCircle, TrendingUp, Calendar, ArrowUp, ArrowDown, 
  LineChart as LineChartIcon, PieChart as PieChartIcon, 
  BarChart as BarChartIcon, Activity
} from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { DataCard } from "@/components/ui/DataCard";
import { EmptyState } from "@/components/ui/EmptyState";

// Demo data for when real data is not available
const DEMO_PROJECT_CATEGORIES = [
  { name: "Boliger", count: 4 },
  { name: "Erhverv", count: 2 },
  { name: "Institutioner", count: 1 },
];

const DEMO_PROJECT_STATUSES = [
  { name: "Aktiv", count: 5 },
  { name: "Problem", count: 1 },
  { name: "Udfordring", count: 1 },
];

const DEMO_PROJECT_PROGRESS = [
  { month: "Jan", afvigelser: 5, tillægsopgaver: 2 },
  { month: "Feb", afvigelser: 8, tillægsopgaver: 3 },
  { month: "Mar", afvigelser: 12, tillægsopgaver: 5 },
  { month: "Apr", afvigelser: 7, tillægsopgaver: 8 },
  { month: "Maj", afvigelser: 15, tillægsopgaver: 10 },
  { month: "Jun", afvigelser: 10, tillægsopgaver: 7 },
];

const DEMO_QUALITY_ASSURANCE = [
  { name: "Godkendt", percentage: 65 },
  { name: "Afventer", percentage: 25 },
  { name: "Fejl", percentage: 10 },
];

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const chartTheme = isDarkMode ? "dark" : "light";
  const [hasError, setHasError] = useState(false);
  
  // Demo data for stats
  const stats = {
    activeProjects: 7,
    openDeviations: 12,
    qualityAssurancePercent: 65,
    additionalTasksCount: 15,
    projectsIncrease: 8,
    deviationsIncrease: 12,
    qaIncrease: 5,
    additionalTasksDecrease: 3
  };
  
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

  // If we encounter an error with DataContext
  useEffect(() => {
    try {
      // Just a test to see if we're going to encounter an error
      const testDataContextAccess = () => {
        try {
          const testElement = document.createElement('div');
          return true;
        } catch (e) {
          console.error("Dashboard initialization error:", e);
          setHasError(true);
          return false;
        }
      };
      
      testDataContextAccess();
    } catch (error) {
      console.error("Error in dashboard:", error);
      setHasError(true);
    }
  }, []);

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
            <DataCard
              title="Aktive projekter"
              value={stats.activeProjects}
              icon={<Building className="h-5 w-5" />}
              trend={{
                value: stats.projectsIncrease,
                positive: true
              }}
            />
            
            <DataCard
              title="Åbne afvigelser"
              value={stats.openDeviations}
              icon={<AlertTriangle className="h-5 w-5" />}
              trend={{
                value: stats.deviationsIncrease,
                positive: false
              }}
            />
            
            <DataCard
              title="KS godkendt"
              value={`${stats.qualityAssurancePercent}%`}
              icon={<CheckCircle className="h-5 w-5" />}
              trend={{
                value: stats.qaIncrease,
                positive: true
              }}
            />
            
            <DataCard
              title="Tillægsopgaver"
              value={stats.additionalTasksCount}
              icon={<PlusCircle className="h-5 w-5" />}
              trend={{
                value: stats.additionalTasksDecrease,
                positive: false
              }}
            />
          </div>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Oversigt</TabsTrigger>
              <TabsTrigger value="projects">Projekter</TabsTrigger>
              <TabsTrigger value="quality">Kvalitetssikring</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <BentoGrid>
                <BentoCard 
                  className="col-span-1 row-span-2 md:col-span-2"
                  title="Afvigelser og tillægsopgaver"
                  icon={<Activity className="h-5 w-5 text-blue-500" />}
                  content={
                    <BarChart 
                      data={DEMO_PROJECT_PROGRESS} 
                      index="month"
                      categories={["afvigelser", "tillægsopgaver"]}
                      stack={true}
                      className="h-80 mt-4"
                      theme={chartTheme}
                      showAnimation={true}
                    />
                  }
                />
                
                <BentoCard
                  title="Projekter efter kategori"
                  icon={<PieChartIcon className="h-5 w-5 text-blue-500" />}
                  content={
                    <div>
                      <PieChart 
                        data={DEMO_PROJECT_CATEGORIES} 
                        index="name" 
                        categories={["count"]} 
                        valueFormatter={(value) => `${value} projekter`}
                        className="h-60 mt-4"
                        theme={chartTheme}
                        showAnimation={true}
                      />
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {DEMO_PROJECT_CATEGORIES.map((category) => (
                          <div key={category.name} className="flex items-center">
                            {getCategoryIcon(category.name)}
                            <span className="ml-2 text-xs">{category.name} ({category.count})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                />
                
                <BentoCard
                  title="Projekt status"
                  icon={<BarChartIcon className="h-5 w-5 text-blue-500" />}
                  content={
                    <DonutChart
                      data={DEMO_PROJECT_STATUSES}
                      index="name"
                      categories={["count"]}
                      valueFormatter={(value) => `${value} projekter`}
                      className="h-60 mt-4"
                      theme={chartTheme}
                      showAnimation={true}
                    />
                  }
                />
                
                <BentoCard
                  title="Kvalitetssikring status"
                  icon={<CheckCircle className="h-5 w-5 text-blue-500" />}
                  content={
                    <DonutChart
                      data={DEMO_QUALITY_ASSURANCE}
                      index="name"
                      categories={["percentage"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-60 mt-4"
                      theme={chartTheme}
                      showAnimation={true}
                    />
                  }
                />
              </BentoGrid>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Projekt oversigt</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState 
                    title="Ingen projekt data" 
                    description="Der er ingen projekt data at vise på nuværende tidspunkt."
                    icon="file"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quality" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Kvalitetssikring</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState 
                    title="Ingen kvalitetssikrings data" 
                    description="Der er ingen kvalitetssikrings data at vise på nuværende tidspunkt."
                    icon="search"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team status</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState 
                    title="Ingen team data" 
                    description="Der er ingen team data at vise på nuværende tidspunkt."
                    icon="alert"
                  />
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
