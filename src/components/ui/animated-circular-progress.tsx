
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCircularProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  duration?: number;
  label?: string;
  className?: string;
}

export const AnimatedCircularProgress = ({
  value,
  size = 'md',
  color = 'stroke-primary',
  duration = 1,
  label,
  className,
}: AnimatedCircularProgressProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Animate from current value to new value
    const startValue = progress;
    const endValue = Math.min(100, Math.max(0, value)); // Ensure value is between 0-100
    const startTime = performance.now();
    
    const animateProgress = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const animationProgress = Math.min(elapsedTime / (duration * 1000), 1);
      const currentValue = startValue + (endValue - startValue) * animationProgress;
      
      setProgress(currentValue);
      
      if (animationProgress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    requestAnimationFrame(animateProgress);
  }, [value, duration]);
  
  // Size configurations
  const sizeConfig = {
    sm: {
      containerSize: 'h-14 w-14',
      circleSize: 'h-12 w-12',
      fontSize: 'text-xs',
      strokeWidth: 3,
      radius: 18,
    },
    md: {
      containerSize: 'h-20 w-20',
      circleSize: 'h-16 w-16',
      fontSize: 'text-sm',
      strokeWidth: 4,
      radius: 24,
    },
    lg: {
      containerSize: 'h-28 w-28',
      circleSize: 'h-24 w-24',
      fontSize: 'text-base',
      strokeWidth: 5,
      radius: 36,
    },
  };
  
  const { containerSize, circleSize, fontSize, strokeWidth, radius } = sizeConfig[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className={cn('relative flex items-center justify-center', containerSize)}>
        {/* Background circle */}
        <svg className="absolute inset-0" width="100%" height="100%" viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius * 2 + strokeWidth * 2}`}>
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
        </svg>
        
        {/* Progress circle */}
        <svg 
          className="absolute inset-0 -rotate-90 transform" 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius * 2 + strokeWidth * 2}`}
        >
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(color, "transition-all duration-500 ease-out")}
          />
        </svg>
        
        {/* Center text */}
        <div className={cn('flex flex-col items-center justify-center', circleSize)}>
          <span className={cn('font-semibold', fontSize)}>
            {Math.round(progress)}%
          </span>
          {label && (
            <span className={cn('text-xs text-gray-500 mt-0.5')}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
