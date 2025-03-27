
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CircleDashed, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar,
  HelpCircle,
  Users,
  ClipboardList,
  FileText
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ProjectStatsProps {
  stats: {
    progress: number;
    daysRemaining?: number;
    daysElapsed?: number;
    startDate?: string;
    endDate?: string;
    totalDays?: number;
    deviations: number;
    documents: number;
    tasks: number;
    tasksCompleted: number;
    teamMembers: number;
  };
  className?: string;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({
  stats,
  className = ""
}) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-600";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Calculate completion percentage for tasks
  const taskCompletionPercent = stats.tasks > 0 
    ? Math.round((stats.tasksCompleted / stats.tasks) * 100) 
    : 0;

  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Ikke angivet';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('da-DK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Projekt Statistik</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1 rounded-full hover:bg-gray-100 cursor-help">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Denne sektion viser nøgletal for projektet, 
                  herunder fremgang, tidsplan og aktiviteter.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <CircleDashed className="h-4 w-4 mr-1 text-indigo-600" />
                    <span className="font-medium">Samlet fremgang</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Den samlede fremgang for projektet baseret på gennemførte opgaver</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <span className="font-bold">{stats.progress}%</span>
          </div>
          <Progress 
            value={stats.progress} 
            className={`h-2 ${getProgressColor(stats.progress)}`} 
          />
        </div>
        
        {/* Time stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-1 text-indigo-600" />
              <span className="text-sm font-medium">Tidsperiode</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Start:</span>
                <div className="font-medium">{formatDate(stats.startDate)}</div>
              </div>
              <div>
                <span className="text-gray-500">Slut:</span>
                <div className="font-medium">{formatDate(stats.endDate)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 mr-1 text-indigo-600" />
              <span className="text-sm font-medium">Tidsforbrug</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Dage brugt:</span>
                <div className="font-medium">{stats.daysElapsed || 0} dage</div>
              </div>
              <div>
                <span className="text-gray-500">Dage tilbage:</span>
                <div className="font-medium">{stats.daysRemaining || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-5 w-5 mb-1 text-red-500" />
              <span className="text-2xl font-bold">{stats.deviations}</span>
              <span className="text-xs text-gray-500">Afvigelser</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex flex-col items-center text-center">
              <FileText className="h-5 w-5 mb-1 text-blue-500" />
              <span className="text-2xl font-bold">{stats.documents}</span>
              <span className="text-xs text-gray-500">Dokumenter</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex flex-col items-center text-center">
              <ClipboardList className="h-5 w-5 mb-1 text-yellow-500" />
              <span className="text-2xl font-bold">
                {stats.tasksCompleted}/{stats.tasks}
              </span>
              <span className="text-xs text-gray-500">Opgaver</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex flex-col items-center text-center">
              <Users className="h-5 w-5 mb-1 text-green-500" />
              <span className="text-2xl font-bold">{stats.teamMembers}</span>
              <span className="text-xs text-gray-500">Medarbejdere</span>
            </div>
          </div>
        </div>
        
        {/* Task completion */}
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-sm font-medium">Opgaver gennemført</span>
            </div>
            <span className="text-sm font-medium">{taskCompletionPercent}%</span>
          </div>
          <Progress value={taskCompletionPercent} className="h-2 bg-green-600" />
        </div>
        
        {/* Alerts if needed */}
        {stats.deviations > 0 && (
          <Alert className="bg-red-50 text-red-800 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Der er {stats.deviations} afvigelser, der kræver opmærksomhed.
            </AlertDescription>
          </Alert>
        )}
        
        {stats.daysRemaining !== undefined && stats.daysRemaining < 7 && stats.progress < 90 && (
          <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Projektet har kun {stats.daysRemaining} dage tilbage, men er kun {stats.progress}% færdigt.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
