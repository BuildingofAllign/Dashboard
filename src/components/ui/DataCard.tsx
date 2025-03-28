
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface DataCardProps {
  title: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  loading?: boolean;
  trend?: {
    value: number;
    label?: string;
    positive?: boolean;
  };
  onClick?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  icon,
  footer,
  description,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  loading = false,
  trend,
  onClick,
  actionLabel,
  actionIcon = <ChevronRight className="h-4 w-4" />,
  onAction,
}) => {
  // Trend indicator
  const TrendIndicator = () => {
    if (!trend) return null;
    
    const { value, label, positive } = trend;
    const isPositive = positive ?? value >= 0;
    
    return (
      <div className={cn(
        'flex items-center gap-1 text-xs font-medium',
        isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      )}>
        <span className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full',
          isPositive 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        )}>
          {isPositive ? '↑' : '↓'}
        </span>
        <span>{Math.abs(value)}%</span>
        {label && <span className="text-muted-foreground">{label}</span>}
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 overflow-hidden',
        onClick ? 'cursor-pointer hover:shadow-md hover:border-primary/20' : '',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className={cn('pb-2', headerClassName)}>
        <div className="flex justify-between items-start">
          <div>
            {loading ? (
              <Skeleton className="h-5 w-24 mb-1" />
            ) : (
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            )}
            {description && !loading && (
              <CardDescription>{description}</CardDescription>
            )}
            {description && loading && (
              <Skeleton className="h-3 w-32 mt-1" />
            )}
          </div>
          {icon && !loading && (
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          {icon && loading && (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </div>
      </CardHeader>
      <CardContent className={cn('pt-0', contentClassName)}>
        {loading ? (
          <Skeleton className="h-10 w-3/4" />
        ) : (
          <div className="flex items-end gap-3">
            <div className="text-2xl font-bold">{value}</div>
            <TrendIndicator />
          </div>
        )}
      </CardContent>
      {(footer || actionLabel || onAction) && (
        <CardFooter className={cn(
          'pt-2 flex items-center justify-between',
          footerClassName
        )}>
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <>
              <div className="text-xs text-muted-foreground">{footer}</div>
              {actionLabel && onAction && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction();
                  }}
                  className="text-xs gap-1 h-7 px-2 py-1"
                >
                  {actionLabel}
                  {actionIcon}
                </Button>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
