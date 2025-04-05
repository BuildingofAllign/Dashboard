
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Circle 
} from 'lucide-react';

export type Priority = 'red' | 'yellow' | 'green' | 'grey';

export interface PriorityIndicatorProps {
  priority: Priority;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
  priority,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  // Map priority values to configuration
  const priorityConfig: Record<Priority, { icon: any, color: string, bgColor: string, label: string }> = {
    red: {
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-950/30',
      label: 'Høj prioritet'
    },
    yellow: {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-950/30',
      label: 'Medium prioritet'
    },
    green: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-950/30',
      label: 'Lav prioritet'
    },
    grey: {
      icon: Circle,
      color: 'text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      label: 'Ingen prioritet'
    }
  };

  // Safely access the configuration or fallback to grey
  const config = priorityConfig[priority] || priorityConfig.grey;
  const { icon: Icon, color, bgColor, label } = config;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('flex items-center justify-center rounded-full p-0.5', bgColor)}>
        <Icon className={cn(sizeClasses[size], color)} />
      </span>
      {showLabel && <span className={cn("text-sm font-medium", color)}>{label}</span>}
    </div>
  );
};
