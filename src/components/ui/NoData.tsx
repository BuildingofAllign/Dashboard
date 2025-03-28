
import React from 'react';
import { FileX, AlertCircle, Search, Database } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface NoDataProps {
  title?: string;
  description?: string;
  icon?: 'file' | 'alert' | 'search' | 'database' | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const NoData: React.FC<NoDataProps> = ({
  title = 'Ingen data fundet',
  description = 'Der er ingen data at vise på nuværende tidspunkt.',
  icon = 'file',
  actionLabel,
  onAction,
  action,
  className,
}) => {
  const getIcon = () => {
    if (React.isValidElement(icon)) return icon;
    
    switch (icon) {
      case 'file':
        return <FileX className="h-12 w-12 text-muted-foreground" />;
      case 'alert':
        return <AlertCircle className="h-12 w-12 text-muted-foreground" />;
      case 'search':
        return <Search className="h-12 w-12 text-muted-foreground" />;
      case 'database':
        return <Database className="h-12 w-12 text-muted-foreground" />;
      default:
        return <FileX className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-10 text-center", className)}>
      <div className="mb-4 rounded-full bg-muted p-3">
        {getIcon()}
      </div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
      {actionLabel && onAction && !action && (
        <Button
          onClick={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
