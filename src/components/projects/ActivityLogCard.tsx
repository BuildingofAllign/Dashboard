
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  MessageCircle, 
  UserPlus, 
  Edit, 
  Calendar,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export type ActivityType = 
  | 'task_created' 
  | 'task_completed' 
  | 'deviation_reported' 
  | 'document_uploaded' 
  | 'message_sent' 
  | 'member_added'
  | 'project_edited'
  | 'milestone_reached';

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string; // ISO string
  user: {
    id: string;
    name: string;
    initials: string;
    avatarColor: string;
  };
  project?: {
    id: number;
    name: string;
  };
  relatedItemId?: string;
};

const getRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMs = now.getTime() - activityTime.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return diffDays === 1 ? 'i går' : `${diffDays} dage siden`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? 'time' : 'timer'} siden`;
  } else if (diffMins > 0) {
    return `${diffMins} ${diffMins === 1 ? 'minut' : 'minutter'} siden`;
  } else {
    return 'lige nu';
  }
};

interface ActivityIconProps {
  type: ActivityType;
  className?: string;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ type, className = "h-5 w-5" }) => {
  switch (type) {
    case 'task_created':
      return <CheckCircle className={`${className} text-blue-500`} />;
    case 'task_completed':
      return <CheckCircle className={`${className} text-green-500`} />;
    case 'deviation_reported':
      return <AlertTriangle className={`${className} text-red-500`} />;
    case 'document_uploaded':
      return <FileText className={`${className} text-indigo-500`} />;
    case 'message_sent':
      return <MessageCircle className={`${className} text-purple-500`} />;
    case 'member_added':
      return <UserPlus className={`${className} text-teal-500`} />;
    case 'project_edited':
      return <Edit className={`${className} text-amber-500`} />;
    case 'milestone_reached':
      return <Calendar className={`${className} text-pink-500`} />;
    default:
      return <CheckCircle className={`${className} text-gray-500`} />;
  }
};

interface ActivityLogCardProps {
  activities: ActivityItem[];
  title?: string;
  showProject?: boolean;
  limit?: number;
  onViewAll?: () => void;
  className?: string;
}

export const ActivityLogCard: React.FC<ActivityLogCardProps> = ({
  activities,
  title = "Aktivitetslog",
  showProject = true,
  limit,
  onViewAll,
  className = ""
}) => {
  const displayActivities = limit ? activities.slice(0, limit) : activities;
  
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {onViewAll && activities.length > (limit || 0) && (
          <Button variant="outline" size="sm" onClick={onViewAll}>
            Se alle
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4 p-4">
        {displayActivities.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Ingen aktiviteter at vise</p>
          </div>
        ) : (
          displayActivities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start p-3 rounded-lg transition-colors hover:bg-gray-50"
            >
              <div className="mr-3 mt-1">
                <ActivityIcon type={activity.type} />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col">
                  <p className="font-medium">{activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  )}
                  
                  {showProject && activity.project && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.project.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: activity.user.avatarColor }}
                      >
                        {activity.user.initials}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{activity.user.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <p className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {getRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
