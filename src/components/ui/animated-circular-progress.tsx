
import { cn } from "@/lib/utils";

interface AnimatedCircularProgressProps {
  value: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showValue?: boolean;
  className?: string;
  color?: string;
  strokeWidth?: number;
  background?: string;
  duration?: number;
  max?: number;
  label?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  valueClassName?: string;
  valuePosition?: "inside" | "outside";
}

export function AnimatedCircularProgress({
  value = 0,
  size = "md",
  showValue = true,
  className,
  color = "stroke-primary",
  strokeWidth = 8,
  background = "stroke-muted",
  duration = 1.5,
  max = 100,
  label,
  valuePrefix = "",
  valueSuffix = "%",
  valueClassName,
  valuePosition = "inside",
}: AnimatedCircularProgressProps) {
  const sizeMap = {
    xs: { width: "2rem", height: "2rem", textSize: "text-xs", strokeWidth: strokeWidth || 6 },
    sm: { width: "3rem", height: "3rem", textSize: "text-sm", strokeWidth: strokeWidth || 6 },
    md: { width: "4rem", height: "4rem", textSize: "text-base", strokeWidth: strokeWidth || 8 },
    lg: { width: "6rem", height: "6rem", textSize: "text-lg", strokeWidth: strokeWidth || 10 },
    xl: { width: "8rem", height: "8rem", textSize: "text-xl", strokeWidth: strokeWidth || 12 },
  };

  const { width, height, textSize, strokeWidth: sizeStrokeWidth } = sizeMap[size];
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const progress = (normalizedValue / max) * 100;
  const actualStrokeWidth = strokeWidth || sizeStrokeWidth;
  
  // Adjust radius based on size
  const radius = parseInt(width) / 2 - actualStrokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center justify-center", className)}>
      <svg
        className={cn(
          "transform -rotate-90 transition-transform",
          width,
          height
        )}
        viewBox={`0 0 ${parseInt(width)} ${parseInt(height)}`}
      >
        <circle
          className={cn(background, "transition-all")}
          cx={parseInt(width) / 2}
          cy={parseInt(height) / 2}
          r={radius}
          strokeWidth={actualStrokeWidth}
          fill="none"
        />
        <circle
          className={cn(color, "transition-all")}
          cx={parseInt(width) / 2}
          cy={parseInt(height) / 2}
          r={radius}
          strokeWidth={actualStrokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: `stroke-dashoffset ${duration}s ease-in-out`,
          }}
        />
      </svg>
      
      {showValue && valuePosition === "inside" && (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={cn("font-medium", textSize, valueClassName)}>
            {valuePrefix}{Math.round(normalizedValue)}{valueSuffix}
          </span>
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </div>
      )}
      
      {showValue && valuePosition === "outside" && (
        <div className={cn("mt-1 flex flex-col items-center", valueClassName)}>
          <span className={cn("font-medium", textSize)}>
            {valuePrefix}{Math.round(normalizedValue)}{valueSuffix}
          </span>
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </div>
      )}
    </div>
  );
}
