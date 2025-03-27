
import React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRelativeTime } from "@/lib/date-utils";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: Date | string;
  icon?: React.ReactNode;
  read?: boolean;
};

interface AnimatedListProps {
  items: NotificationItem[];
  className?: string;
}

export function AnimatedList({ items, className }: AnimatedListProps) {
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex items-center mb-4">
        <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Notifications</h3>
        <span className="text-xs ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full">
          {items.filter(item => !item.read).length} new
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Get notified when something happens.
      </p>

      <div className="space-y-1 overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-accent/50",
              item.read ? "opacity-70" : "bg-accent/10",
              "animate-fade-in"
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              {item.icon || (
                <div className="h-6 w-6 rounded-full bg-primary/20" />
              )}
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="truncate font-medium">{item.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {typeof item.time === 'string' ? item.time : getRelativeTime(item.time)}
                </span>
              </div>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
