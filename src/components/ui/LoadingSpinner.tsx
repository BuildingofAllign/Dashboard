
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  textPosition?: 'left' | 'right' | 'top' | 'bottom';
  color?: string;
  className?: string;
  fullPage?: boolean;
  textClassName?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  textPosition = 'right',
  color,
  className,
  fullPage = false,
  textClassName,
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const spinnerSize = sizeMap[size];
  
  const spinner = (
    <Loader2 
      className={cn(
        spinnerSize, 
        'animate-spin', 
        color ? color : 'text-primary',
        className
      )} 
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-6">
          {spinner}
          {text && <p className={cn("text-center text-muted-foreground", textClassName)}>{text}</p>}
        </div>
      </div>
    );
  }

  if (!text) return spinner;

  const textElement = <span className={cn("text-muted-foreground", textClassName)}>{text}</span>;

  switch (textPosition) {
    case 'left':
      return (
        <div className="flex items-center gap-2">
          {textElement}
          {spinner}
        </div>
      );
    case 'right':
      return (
        <div className="flex items-center gap-2">
          {spinner}
          {textElement}
        </div>
      );
    case 'top':
      return (
        <div className="flex flex-col items-center gap-2">
          {textElement}
          {spinner}
        </div>
      );
    case 'bottom':
      return (
        <div className="flex flex-col items-center gap-2">
          {spinner}
          {textElement}
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2">
          {spinner}
          {textElement}
        </div>
      );
  }
};
