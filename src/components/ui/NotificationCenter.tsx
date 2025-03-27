
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  MessageSquare,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'message' | 'calendar' | 'task';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: Date | string;
  read: boolean;
  link?: string;
  data?: any;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
  onRemoveAll: () => void;
  onNavigate?: (notification: Notification) => void;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onRemoveAll,
  onNavigate,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = {
    'all': notifications,
    'unread': notifications.filter(n => !n.read),
    'info': notifications.filter(n => n.type === 'info'),
    'tasks': notifications.filter(n => n.type === 'task'),
    'messages': notifications.filter(n => n.type === 'message'),
    'calendar': notifications.filter(n => n.type === 'calendar'),
  };
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      case 'task':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const formatTime = (time: Date | string) => {
    const date = typeof time === 'string' ? new Date(time) : time;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  const handleNavigate = (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    if (onNavigate) {
      onNavigate(notification);
      setOpen(false);
    } else if (notification.link) {
      window.location.href = notification.link;
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={cn("relative h-9 w-9 rounded-full", className)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifikationer</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-medium">Notifikationer</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMarkAllAsRead} 
                className="h-8 text-xs"
              >
                Markér alle som læst
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onRemoveAll} 
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fjern alle</span>
              </Button>
            )}
          </div>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 p-0 h-12 rounded-none border-b">
            <TabsTrigger value="all" className="data-[state=active]:shadow-none">
              Alle
              {unreadCount > 0 && (
                <span className="ml-1 text-xs">({unreadCount})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:shadow-none">Opgaver</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:shadow-none">Beskeder</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:shadow-none">Kalender</TabsTrigger>
          </TabsList>
          {Object.entries(filteredNotifications).map(([tab, items]) => (
            <TabsContent key={tab} value={tab} className="m-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Bell className="mb-2 h-8 w-8 opacity-30" />
                  <p className="text-sm">Ingen notifikationer</p>
                </div>
              ) : (
                <ScrollArea className="max-h-80">
                  <div className="divide-y">
                    {items.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer relative",
                          !notification.read && "bg-primary/5"
                        )}
                        onClick={(e) => handleNavigate(notification, e)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mr-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Fjern</span>
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(notification.time)}</p>
                        </div>
                        {!notification.read && (
                          <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

// Example hook to manage notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      time: new Date(),
      read: false,
      ...notification,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
  };
  
  const markAsRead = (id: string) => {
    setNotifications((prev) => 
      prev.map((notification) => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications((prev) => 
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };
  
  const removeNotification = (id: string) => {
    setNotifications((prev) => 
      prev.filter((notification) => notification.id !== id)
    );
  };
  
  const removeAllNotifications = () => {
    setNotifications([]);
  };
  
  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeAllNotifications,
  };
};
