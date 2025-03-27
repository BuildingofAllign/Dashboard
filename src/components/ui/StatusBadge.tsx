
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

export type StatusType = 
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
  'custom' |
  'igangværende' | 
  'planlagt' | 
  'afsluttet';

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
  const getStatusConfig = (statusType: StatusType): StatusConfig => {
    switch(statusType) {
      case 'success':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-400',
          icon: <CheckCircle className="h-4 w-4" />
        };
      case 'error':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-400',
          icon: <XCircle className="h-4 w-4" />
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-400',
          icon: <AlertCircle className="h-4 w-4" />
        };
      case 'info':
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-400',
          icon: <Eye className="h-4 w-4" />
        };
      case 'pending':
        return {
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          textColor: 'text-purple-800 dark:text-purple-400',
          icon: <Clock className="h-4 w-4" />
        };
      case 'active':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-400',
          icon: <Activity className="h-4 w-4" />
        };
      case 'inactive':
        return {
          bgColor: 'bg-gray-100 dark:bg-gray-800/50',
          textColor: 'text-gray-800 dark:text-gray-400',
          icon: <PauseCircle className="h-4 w-4" />
        };
      case 'approved':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-400',
          icon: <ThumbsUp className="h-4 w-4" />
        };
      case 'rejected':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-400',
          icon: <XCircle className="h-4 w-4" />
        };
      case 'waiting':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-400',
          icon: <Clock className="h-4 w-4" />
        };
      case 'reviewing':
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-400',
          icon: <Eye className="h-4 w-4" />
        };
      case 'paused':
        return {
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          textColor: 'text-orange-800 dark:text-orange-400',
          icon: <PauseCircle className="h-4 w-4" />
        };
      case 'running':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-400',
          icon: <PlayCircle className="h-4 w-4" />
        };
      case 'igangværende':
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-400',
          icon: <PlayCircle className="h-4 w-4" />
        };
      case 'planlagt':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-400',
          icon: <Clock className="h-4 w-4" />
        };
      case 'afsluttet':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-400',
          icon: <CheckCircle className="h-4 w-4" />
        };
      case 'custom':
        return {
          bgColor: customColor || 'bg-gray-100 dark:bg-gray-800/50',
          textColor: customTextColor || 'text-gray-800 dark:text-gray-400',
          icon: customIcon || <HelpCircle className="h-4 w-4" />
        };
      default:
        return {
          bgColor: 'bg-gray-100 dark:bg-gray-800/50',
          textColor: 'text-gray-800 dark:text-gray-400',
          icon: <HelpCircle className="h-4 w-4" />
        };
    }
  };

  const config = getStatusConfig(status);
  const { bgColor, textColor, icon } = config;
  
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
      {label || status}
    </span>
  );
};
