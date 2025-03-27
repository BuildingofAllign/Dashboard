import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/ui/cards/metric-card"
import { ChartCard } from "@/components/ui/cards/chart-card"
import { ActivityGoal } from "@/components/ui/cards/activity-goal"
import { AnimatedList } from "@/components/ui/AnimatedList"
import { 
  Building, Building2, Home, User, Clock, CheckCircle, AlertTriangle, 
  PlusCircle, TrendingUp, Calendar, ArrowUp, ArrowDown, 
  LineChart as LineChartIcon, PieChart as PieChartIcon, 
  BarChart as BarChartIcon, Activity, MessageSquare, FileText
} from "lucide-react"
import { BreadcrumbNav } from "@/components/ui/BreadcrumbNav"

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

const DEMO_RECENT_ACTIVITIES = [
  { name: "Anders Jensen", email: "anders@example.com", amount: "2 afvigelser" },
  { name: "Mette Nielsen", email: "mette@example.com", amount: "1 tegning" },
  { name: "Lars Petersen", email: "lars@example.com", amount: "KS godkendt" },
  { name: "Sofie Hansen", email: "sofie@example.com", amount: "3 tillæg" },
  { name: "Peter Madsen", email: "peter@example.com", amount: "Projekt opdateret" },
];

const DEMO_NOTIFICATIONS = [
  {
    id: "1",
    title: "New event",
    description: "A new event has been scheduled",
    time: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    icon: <Calendar className="h-5 w-5 text-primary" />,
    read: false
  },
  {
    id: "2",
    title: "New message",
    description: "You have received a new message",
    time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    icon: <MessageSquare className="h-5 w-5 text-indigo-500" />,
    read: false
  },
  {
    id: "3",
    title: "User signed up",
    description: "A new user has registered on the platform",
    time: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    icon: <User className="h-5 w-5 text-amber-500" />,
    read: true
  },
  {
    id: "4",
    title: "Project updated",
    description: "Project 'Renovering Vestergade' has been updated",
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    icon: <FileText className="h-5 w-5 text-green-500" />,
    read: true
  }
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

export function DashboardContent() {
  const currentDate = new Date().toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  const breadcrumbItems = [
    { label: "Dashboard" }
  ];

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

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BreadcrumbNav items={breadcrumbItems} className="mb-4" />
        
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <p className="text-gray-500 dark:text-gray-400">{formattedDate}</p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Oversigt</TabsTrigger>
            <TabsTrigger value="projects">Projekter</TabsTrigger>
            <TabsTrigger value="quality">Kvalitetssikring</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Aktive projekter"
                value={stats.activeProjects}
                icon={<Building className="h-4 w-4 text-muted-foreground" />}
                trend={{
                  value: stats.projectsIncrease,
                  positive: true
                }}
              />
              
              <MetricCard
                title="Åbne afvigelser"
                value={stats.openDeviations}
                icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                trend={{
                  value: stats.deviationsIncrease,
                  positive: false
                }}
              />
              
              <MetricCard
                title="KS godkendt"
                value={`${stats.qualityAssurancePercent}%`}
                icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
                trend={{
                  value: stats.qaIncrease,
                  positive: true
                }}
              />
              
              <MetricCard
                title="Tillægsopgaver"
                value={stats.additionalTasksCount}
                icon={<PlusCircle className="h-4 w-4 text-muted-foreground" />}
                trend={{
                  value: stats.additionalTasksDecrease,
                  positive: false
                }}
              />
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
                  <AnimatedList items={DEMO_NOTIFICATIONS} />
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
              />
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Projekt oversigt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-10">
                    Der er ingen projekt data at vise på nuværende tidspunkt.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Kvalitetssikring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-10">
                    Der er ingen kvalitetssikrings data at vise på nuværende tidspunkt.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Team status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-10">
                    Der er ingen team data at vise på nuværende tidspunkt.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
