
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
  
  const priorityConfig = {
    red: {
      icon: AlertCircle,
      color: 'text-red-500',
      label: 'Høj prioritet'
    },
    yellow: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      label: 'Medium prioritet'
    },
    green: {
      icon: CheckCircle,
      color: 'text-green-500',
      label: 'Lav prioritet'
    },
    grey: {
      icon: Circle,
      color: 'text-gray-400',
      label: 'Ingen prioritet'
    }
  };

  const { icon: Icon, color, label } = priorityConfig[priority];

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Icon className={cn(sizeClasses[size], color)} />
      {showLabel && <span className="text-sm">{label}</span>}
    </div>
  );
};
