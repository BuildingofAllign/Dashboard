import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, AlertTriangle, Calendar, MessageSquare, User, FileText, Server, Upload, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRelativeTime } from "@/lib/date-utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: Date | string;
  icon_type: string;
  read: boolean;
};

interface AnimatedListProps {
  className?: string;
  maxHeight?: string;
  showControls?: boolean;
  filter?: string;
}

export function AnimatedList({ className, maxHeight = "400px", showControls = true, filter = "all" }: AnimatedListProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRead, setShowRead] = useState(true);
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('time', { ascending: false });
      
      if (error) throw error;
      
      setItems(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error.message);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, read: true } : item
        )
      );
      
      toast.success('Notification marked as read');
    } catch (error: any) {
      console.error('Error marking notification as read:', error.message);
      toast.error('Failed to update notification');
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const unreadIds = items.filter(item => !item.read).map(item => item.id);
      
      if (unreadIds.length === 0) {
        toast.info('No unread notifications');
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);
      
      if (error) throw error;
      
      setItems(prevItems => 
        prevItems.map(item => ({ ...item, read: true }))
      );
      
      toast.success(`${unreadIds.length} notifications marked as read`);
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error.message);
      toast.error('Failed to update notifications');
    }
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'calendar':
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      case 'message-square':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'user':
        return <User className="h-5 w-5 text-amber-500" />;
      case 'file-text':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'check-circle':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'server':
        return <Server className="h-5 w-5 text-slate-500" />;
      case 'alert-triangle':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'upload':
        return <Upload className="h-5 w-5 text-blue-500" />;
      case 'shield-check':
        return <Shield className="h-5 w-5 text-purple-500" />;
      case 'users':
        return <Users className="h-5 w-5 text-teal-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };
  
  const filteredByType = filter === "all" 
    ? items 
    : items.filter(item => item.icon_type === filter);
  
  const filteredItems = showRead 
    ? filteredByType 
    : filteredByType.filter(item => !item.read);
  
  if (loading) {
    return (
      <div className={cn("flex flex-col space-y-4", className)}>
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(item => (
            <div key={item} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="h-10 w-10 rounded-full bg-primary/10"></div>
              <div className="flex-1">
                <div className="h-4 w-2/3 bg-muted rounded mb-2"></div>
                <div className="h-3 w-full bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex items-center mb-4">
        <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Notifications</h3>
        <span className="text-xs ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full">
          {items.filter(item => !item.read).length} new
        </span>
      </div>
      
      {showControls && (
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setShowRead(!showRead)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showRead ? "Hide read" : "Show read"}
          </button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-xs h-7"
          >
            Mark all as read
          </Button>
        </div>
      )}
      
      <div className={cn("space-y-1 overflow-hidden", maxHeight && `max-h-[${maxHeight}] overflow-auto pr-1`)}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-accent/50",
                item.read ? "opacity-70" : "bg-accent/10",
                "animate-fade-in"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {getIconForType(item.icon_type)}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="truncate font-medium">{item.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {typeof item.time === 'string' ? getRelativeTime(new Date(item.time)) : getRelativeTime(item.time)}
                  </span>
                </div>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              
              {!item.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => markAsRead(item.id)}
                  className="h-8 w-8 shrink-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No notifications to show</p>
          </div>
        )}
      </div>
    </div>
  );
}
