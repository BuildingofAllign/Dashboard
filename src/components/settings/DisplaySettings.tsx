
import React, { useState } from "react";
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info";
  read: boolean;
};

export const DisplaySettings: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Projekt opdateret",
      description: "Projekt 'Renovering Vestergade' er blevet opdateret",
      time: "for 5 min siden",
      type: "success",
      read: false,
    },
    {
      id: "2",
      title: "Ny afvigelse registreret",
      description: "Der er registreret en ny afvigelse i 'Nybyggeri Østerbro'",
      time: "for 1 time siden",
      type: "warning",
      read: false,
    },
    {
      id: "3",
      title: "Nyt dokument tilgængeligt",
      description: "Der er uploadet en ny tegning til 'Tilbygning Nørrebro'",
      time: "for 3 timer siden",
      type: "info",
      read: true,
    },
  ]);

  const [showRead, setShowRead] = useState(true);

  const getIconForType = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const filteredNotifications = showRead 
    ? notifications 
    : notifications.filter(n => !n.read);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Skærm</h2>
        <p className="text-muted-foreground text-sm">
          Konfigurer skærmindstillinger og notifikationer.
        </p>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-card p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-base font-medium">Notifikationer</h3>
            <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length} nye
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-read" 
                checked={showRead} 
                onCheckedChange={() => setShowRead(!showRead)} 
              />
              <label htmlFor="show-read" className="text-sm text-muted-foreground cursor-pointer">
                Vis læste
              </label>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Marker alle som læst
            </Button>
          </div>
        </div>
        
        <div className="divide-y max-h-[400px] overflow-auto">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-4 transition-colors hover:bg-accent/50 flex gap-3",
                  notification.read ? "bg-background" : "bg-accent/10"
                )}
              >
                <div className="mt-0.5">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => markAsRead(notification.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Marker som læst</span>
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Ingen notifikationer at vise</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 text-center border rounded-md bg-card">
        <p className="text-muted-foreground">
          Flere skærmindstillinger vil være tilgængelige snart.
        </p>
      </div>
    </div>
  );
};
