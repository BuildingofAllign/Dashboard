
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export type TimelineEventType = 
  | 'task_created' 
  | 'task_completed' 
  | 'deviation_reported' 
  | 'document_uploaded' 
  | 'message_sent' 
  | 'member_added'
  | 'project_edited'
  | 'milestone_reached';

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  date: string; // ISO string for date
  time?: string; // Optional time string
  user: {
    name: string;
    initials: string;
    color: string;
  };
};

interface TimelineEventIconProps {
  type: TimelineEventType;
}

const TimelineEventIcon: React.FC<TimelineEventIconProps> = ({ type }) => {
  const getIconByType = () => {
    switch (type) {
      case 'task_created':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'task_completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'deviation_reported':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'document_uploaded':
        return <FileText className="h-5 w-5 text-indigo-500" />;
      case 'message_sent':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'member_added':
        return <UserPlus className="h-5 w-5 text-teal-500" />;
      case 'project_edited':
        return <Edit className="h-5 w-5 text-amber-500" />;
      case 'milestone_reached':
        return <Calendar className="h-5 w-5 text-pink-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white shadow-md ${getEventColorClass(type)}`}>
      {getIconByType()}
    </div>
  );
};

const getEventColorClass = (type: TimelineEventType): string => {
  switch (type) {
    case 'task_created':
      return 'bg-blue-50';
    case 'task_completed':
      return 'bg-green-50';
    case 'deviation_reported':
      return 'bg-red-50';
    case 'document_uploaded':
      return 'bg-indigo-50';
    case 'message_sent':
      return 'bg-purple-50';
    case 'member_added':
      return 'bg-teal-50';
    case 'project_edited':
      return 'bg-amber-50';
    case 'milestone_reached':
      return 'bg-pink-50';
    default:
      return 'bg-gray-50';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('da-DK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

interface ProjectTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ 
  events,
  className = "" 
}) => {
  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle>Projekt Tidslinje</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Ingen begivenheder at vise</p>
          </div>
        ) : (
          <div className="relative pl-8">
            {/* Vertical timeline line */}
            <div className="absolute left-4 top-0 h-full w-px bg-gray-200" />
            
            <div className="space-y-6">
              {sortedEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Event icon */}
                  <div className="absolute -left-8 top-0">
                    <TimelineEventIcon type={event.type} />
                  </div>
                  
                  {/* Event content */}
                  <div className={`ml-2 rounded-lg p-4 transition-colors ${getEventColorClass(event.type)}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className="ml-2">
                        {formatDate(event.date)}
                        {event.time && ` • ${event.time}`}
                      </Badge>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    )}
                    
                    <div className="flex justify-end items-center mt-2">
                      <span className="text-xs text-gray-500 mr-2">Oprettet af</span>
                      <div 
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: event.user.color }}
                      >
                        {event.user.initials}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
