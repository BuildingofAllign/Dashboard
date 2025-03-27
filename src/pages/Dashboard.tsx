
import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  AlertCircle, 
  PlusCircle,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Dummy data for the dashboard
const projectProgress = [
  { name: 'Skovvej 12', progress: 75 },
  { name: 'Havnegade 8', progress: 45 },
  { name: 'Stationsvej 23', progress: 90 },
  { name: 'Bredgade 45', progress: 0 },
];

const recentActivity = [
  { type: 'drawing', action: 'Ny tegning uploadet', project: 'Skovvej 12', time: '10 min siden', user: 'MN' },
  { type: 'deviation', action: 'Afvigelse registreret', project: 'Havnegade 8', time: '1 time siden', user: 'BS' },
  { type: 'task', action: 'Tillægsopgave oprettet', project: 'Stationsvej 23', time: '3 timer siden', user: 'JP' },
  { type: 'message', action: 'Ny besked fra kunde', project: 'Skovvej 12', time: '5 timer siden', user: 'KL' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title="Dashboard" userInitials="BL" />

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
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
            
            <Card>
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
            
            <Card>
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
            
            <Card>
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Project Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Projekt Fremgang</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectProgress}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="progress" fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Seneste Aktivitet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start">
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
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Aktive Projekter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectProgress.slice(0, 3).map((project, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <span className="text-sm text-gray-500">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            project.progress >= 75 ? "bg-green-600" : 
                            project.progress >= 25 ? "bg-blue-600" : 
                            "bg-yellow-500"
                          }`} 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                      JP
                    </div>
                    <div>
                      <p className="font-medium">Jens Paulsen</p>
                      <p className="text-sm text-gray-500">Tømrer</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mr-3">
                      BS
                    </div>
                    <div>
                      <p className="font-medium">Boktogan Saruhan</p>
                      <p className="text-sm text-gray-500">Elektriker</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold mr-3">
                      MN
                    </div>
                    <div>
                      <p className="font-medium">Mette Nielsen</p>
                      <p className="text-sm text-gray-500">Ingeniør</p>
                    </div>
                  </div>
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
