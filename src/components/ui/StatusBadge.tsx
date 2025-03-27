
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Activity,
  ThumbsUp,
  PauseCircle,
  PlayCircle,
  HelpCircle
} from 'lucide-react';

type StatusType = 
  'success' | 
  'error' | 
  'warning' | 
  'info' | 
  'pending' | 
  'active' | 
  'inactive' | 
  'approved' | 
  'rejected' | 
  'waiting' | 
  'reviewing' | 
  'paused' | 
  'running' | 
  'custom';

interface StatusConfig {
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
}

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  customColor?: string;
  customTextColor?: string;
  customIcon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className,
  size = 'md',
  customColor,
  customTextColor,
  customIcon,
}) => {
  const statusConfig: Record<StatusType, StatusConfig> = {
    success: {
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-400',
      icon: <CheckCircle className="h-4 w-4" />
    },
    error: {
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-400',
      icon: <XCircle className="h-4 w-4" />
    },
    warning: {
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-800 dark:text-yellow-400',
      icon: <AlertCircle className="h-4 w-4" />
    },
    info: {
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-400',
      icon: <Eye className="h-4 w-4" />
    },
    pending: {
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-800 dark:text-purple-400',
      icon: <Clock className="h-4 w-4" />
    },
    active: {
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-400',
      icon: <Activity className="h-4 w-4" />
    },
    inactive: {
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      textColor: 'text-gray-800 dark:text-gray-400',
      icon: <PauseCircle className="h-4 w-4" />
    },
    approved: {
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-400',
      icon: <ThumbsUp className="h-4 w-4" />
    },
    rejected: {
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-400',
      icon: <XCircle className="h-4 w-4" />
    },
    waiting: {
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-800 dark:text-yellow-400',
      icon: <Clock className="h-4 w-4" />
    },
    reviewing: {
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-400',
      icon: <Eye className="h-4 w-4" />
    },
    paused: {
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-800 dark:text-orange-400',
      icon: <PauseCircle className="h-4 w-4" />
    },
    running: {
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-400',
      icon: <PlayCircle className="h-4 w-4" />
    },
    custom: {
      bgColor: customColor || 'bg-gray-100 dark:bg-gray-800/50',
      textColor: customTextColor || 'text-gray-800 dark:text-gray-400',
      icon: customIcon || <HelpCircle className="h-4 w-4" />
    }
  };

  const { bgColor, textColor, icon } = statusConfig[status];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      bgColor,
      textColor,
      sizeClasses[size],
      className
    )}>
      {icon}
      {label}
    </span>
  );
};
