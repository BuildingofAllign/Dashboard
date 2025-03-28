
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedList } from "@/components/ui/AnimatedList"
import { 
  Building, Building2, Home, User, Clock, CheckCircle, AlertTriangle, 
  PlusCircle, TrendingUp, Calendar, ArrowUp, ArrowDown, 
  LineChart as LineChartIcon, PieChart as PieChartIcon, 
  BarChart as BarChartIcon, Activity, MessageSquare, FileText
} from "lucide-react"
import { BreadcrumbNav } from "@/components/ui/BreadcrumbNav"
import { PrioritizedTasksList } from "./PrioritizedTasksList"
import { RealTimeProjectStatus } from "./RealTimeProjectStatus"
import { ChartCard } from "@/components/ui/cards/chart-card"
import { ActivityGoal } from "@/components/ui/cards/activity-goal"
import { StatCard } from "@/components/ui/StatCard"
import { DataCard } from "@/components/ui/DataCard"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

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

const DEMO_WEEKLY_ACTIVITY = {
  title: "Ugentlige aktiviteter",
  description: "Dit aktivitetsmål for denne uge",
  completed: 16,
  target: 20,
  data: [
    { day: "M", value: 4 },
    { day: "T", value: 3 },
    { day: "O", value: 5 },
    { day: "T", value: 3 },
    { day: "F", value: 1 },
    { day: "L", value: 0 },
    { day: "S", value: 0 },
  ],
};

interface DashboardStats {
  activeProjects: number;
  openDeviations: number;
  qualityAssurancePercent: number;
  additionalTasksCount: number;
  projectsIncrease: number;
  deviationsIncrease: number;
  qaIncrease: number;
  additionalTasksDecrease: number;
  loading: boolean;
}

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    openDeviations: 0,
    qualityAssurancePercent: 0,
    additionalTasksCount: 0,
    projectsIncrease: 0,
    deviationsIncrease: 0,
    qaIncrease: 0,
    additionalTasksDecrease: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Simulate API call with timeout
        setTimeout(() => {
          setStats({
            activeProjects: 7,
            openDeviations: 12,
            qualityAssurancePercent: 65,
            additionalTasksCount: 15,
            projectsIncrease: 8,
            deviationsIncrease: 12,
            qaIncrease: 5,
            additionalTasksDecrease: 3,
            loading: false
          });
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardStats();
  }, []);

  const breadcrumbItems = [
    { label: "Dashboard" }
  ];

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <BreadcrumbNav items={breadcrumbItems} className="mb-2" />
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <FileText className="mr-1.5 h-4 w-4" />
              Rapport
            </Button>
            <Button size="sm" className="h-8">
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Nyt projekt
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-fit">
            <TabsTrigger value="overview">Oversigt</TabsTrigger>
            <TabsTrigger value="projects">Projekter</TabsTrigger>
            <TabsTrigger value="quality">Kvalitetssikring</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Aktive projekter"
                value={stats.activeProjects}
                icon={<Building className="h-4 w-4" />}
                loading={stats.loading}
                trend={{
                  value: stats.projectsIncrease,
                  positive: true,
                  label: "fra sidste måned"
                }}
                variant="info"
              />
              
              <StatCard
                title="Åbne afvigelser"
                value={stats.openDeviations}
                icon={<AlertTriangle className="h-4 w-4" />}
                loading={stats.loading}
                trend={{
                  value: stats.deviationsIncrease,
                  positive: false,
                  label: "fra sidste måned"
                }}
                variant="warning"
              />
              
              <StatCard
                title="KS godkendt"
                value={`${stats.qualityAssurancePercent}%`}
                icon={<CheckCircle className="h-4 w-4" />}
                loading={stats.loading}
                trend={{
                  value: stats.qaIncrease,
                  positive: true,
                  label: "fra sidste måned"
                }}
                variant="success"
              />
              
              <StatCard
                title="Tillægsopgaver"
                value={stats.additionalTasksCount}
                icon={<PlusCircle className="h-4 w-4" />}
                loading={stats.loading}
                trend={{
                  value: stats.additionalTasksDecrease,
                  positive: false,
                  label: "fra sidste måned"
                }}
                variant="default"
              />
            </div>
            
            {/* Real-time project status and prioritized tasks */}
            <div className="grid gap-4 md:grid-cols-7">
              <RealTimeProjectStatus className="md:col-span-4" />
              <PrioritizedTasksList className="md:col-span-3" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <ChartCard
                title="Afvigelser og tillægsopgaver"
                chartType="bar"
                data={DEMO_PROJECT_PROGRESS}
                className="col-span-4"
              />
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Seneste aktiviteter</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedList maxHeight="300px" />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <ChartCard
                title="Projekter efter kategori"
                chartType="pie"
                data={DEMO_PROJECT_CATEGORIES}
                className="col-span-3"
              />
              <ChartCard
                title="Projekt status"
                chartType="pie"
                data={DEMO_PROJECT_STATUSES}
                className="col-span-2"
              />
              <ActivityGoal 
                title={DEMO_WEEKLY_ACTIVITY.title}
                description={DEMO_WEEKLY_ACTIVITY.description}
                completed={DEMO_WEEKLY_ACTIVITY.completed}
                target={DEMO_WEEKLY_ACTIVITY.target}
                data={DEMO_WEEKLY_ACTIVITY.data}
                className="col-span-2"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <DataCard
                title="Aktive projekter"
                value="7"
                icon={<Building className="h-4 w-4" />}
                trend={{ value: 8, positive: true }}
                footer="Opdateret for 3 timer siden"
                actionLabel="Se alle projekter"
                onAction={() => {}}
              />
              
              <DataCard
                title="Projekter efter deadline"
                value="2"
                icon={<AlertTriangle className="h-4 w-4" />}
                trend={{ value: 50, positive: false }}
                footer="2 projekter kræver opmærksomhed"
                actionLabel="Se projekter"
                onAction={() => {}}
              />
              
              <DataCard
                title="Gennemførte projekter (2023)"
                value="12"
                icon={<CheckCircle className="h-4 w-4" />}
                trend={{ value: 25, positive: true }}
                footer="25% flere end sidste år"
                actionLabel="Se statistik"
                onAction={() => {}}
              />
            </div>
              
            <Card>
              <CardHeader>
                <CardTitle>Projekt oversigt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-10">
                  Vælg "Se alle projekter" ovenfor for at se en detaljeret oversigt.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <DataCard
                title="KS gennemført (i alt)"
                value="73%"
                icon={<CheckCircle className="h-4 w-4" />}
                trend={{ value: 5, positive: true }}
                footer="Opdateret i dag"
                actionLabel="Se detaljer"
                onAction={() => {}}
              />
              
              <DataCard
                title="Afventende KS"
                value="18"
                icon={<Clock className="h-4 w-4" />}
                trend={{ value: 12, positive: false }}
                footer="Stigning på 12% fra sidste uge"
                actionLabel="Se liste"
                onAction={() => {}}
              />
              
              <DataCard
                title="Godkendte tegninger"
                value="142"
                icon={<FileText className="h-4 w-4" />}
                footer="Ud af 195 tegninger i alt"
                actionLabel="Se tegninger"
                onAction={() => {}}
              />
            </div>

            <ChartCard
              title="Kvalitetssikring fordeling"
              chartType="pie"
              data={DEMO_QUALITY_ASSURANCE}
              className="md:col-span-3"
            />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <DataCard
                title="Aktive teammedlemmer"
                value="14"
                icon={<User className="h-4 w-4" />}
                footer="Opdateret i dag"
                actionLabel="Se team"
                onAction={() => {}}
              />
              
              <DataCard
                title="Igangværende opgaver"
                value="23"
                icon={<Activity className="h-4 w-4" />}
                trend={{ value: 8, positive: true }}
                footer="8% stigning fra sidste uge"
                actionLabel="Se opgaver"
                onAction={() => {}}
              />
              
              <DataCard
                title="Team beskeder"
                value="47"
                icon={<MessageSquare className="h-4 w-4" />}
                trend={{ value: 24, positive: true }}
                footer="24% stigning i aktivitet"
                actionLabel="Åben chat"
                onAction={() => {}}
              />
            </div>
              
            <Card>
              <CardHeader>
                <CardTitle>Team status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-10">
                  Der er ingen team data at vise på nuværende tidspunkt.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
