
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  textClassName?: string;
  formatter?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  textClassName,
  formatter,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const formatValue = (val: number): string => {
    if (formatter) return formatter(val);
    
    const fixedValue = val.toFixed(decimals);
    return prefix + fixedValue + suffix;
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function: easeOutExpo
    const easedProgress = progress === 1 
      ? 1 
      : 1 - Math.pow(2, -10 * progress);
    
    const currentValue = startValueRef.current + (value - startValueRef.current) * easedProgress;
    
    setDisplayValue(currentValue);

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = 0;
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value]);

  return (
    <div className={cn("inline-block", className)}>
      <span className={cn("font-mono tabular-nums", textClassName)}>
        {formatValue(displayValue)}
      </span>
    </div>
  );
};
