
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from 'lucide-react';

const statCardVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground",
        primary: "border-primary/20 bg-primary/5 text-primary dark:border-primary/30 dark:bg-primary/10",
        success: "border-green-600/20 bg-green-50 text-green-700 dark:border-green-400/30 dark:bg-green-900/20 dark:text-green-400",
        warning: "border-yellow-600/20 bg-yellow-50 text-yellow-700 dark:border-yellow-400/30 dark:bg-yellow-900/20 dark:text-yellow-400",
        danger: "border-red-600/20 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-900/20 dark:text-red-400",
        info: "border-blue-600/20 bg-blue-50 text-blue-700 dark:border-blue-400/30 dark:bg-blue-900/20 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number | React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
    positive?: boolean;
    show?: boolean;
    indicator?: 'arrow' | 'trend' | 'none';
  };
  footer?: React.ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  footer,
  loading = false,
  variant,
  className,
  onClick,
}) => {
  // Trend indicator
  const renderTrend = () => {
    if (!trend || trend.show === false) return null;
    
    const { value, label, positive, indicator = 'arrow' } = trend;
    const isPositive = positive !== undefined ? positive : value >= 0;
    const absValue = Math.abs(value);
    
    let indicatorIcon;
    if (indicator === 'arrow') {
      indicatorIcon = isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
    } else if (indicator === 'trend') {
      indicatorIcon = isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
    }
    
    return (
      <div className={cn(
        "flex items-center text-xs font-medium",
        isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
      )}>
        {indicator !== 'none' && (
          <span className={cn(
            "mr-1 flex h-5 w-5 items-center justify-center rounded-full",
            isPositive 
              ? "bg-green-100 dark:bg-green-900/30" 
              : "bg-red-100 dark:bg-red-900/30"
          )}>
            {indicatorIcon}
          </span>
        )}
        <span>{absValue}%</span>
        {label && <span className="ml-1 text-muted-foreground">{label}</span>}
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        statCardVariants({ variant }),
        onClick ? "cursor-pointer hover:shadow-md" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        {loading ? (
          <Skeleton className="h-4 w-1/2" />
        ) : (
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        )}
        {icon && !loading && (
          <div className="opacity-70">{icon}</div>
        )}
        {icon && loading && (
          <Skeleton className="h-5 w-5 rounded-full" />
        )}
      </CardHeader>
      <CardContent className="pb-2">
        {loading ? (
          <Skeleton className="h-7 w-2/3" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        
        {description && !loading && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
        {description && loading && (
          <Skeleton className="mt-1 h-3 w-3/4" />
        )}
        
        {trend && !loading && (
          <div className="mt-2">{renderTrend()}</div>
        )}
        {trend && loading && (
          <Skeleton className="mt-2 h-4 w-16" />
        )}
      </CardContent>
      
      {footer && (
        <CardFooter className="pt-2">
          {loading ? (
            <Skeleton className="h-3 w-full" />
          ) : (
            <div className="text-xs text-muted-foreground">{footer}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
