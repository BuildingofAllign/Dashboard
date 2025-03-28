
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

export interface BentoGridProps {
  className?: string
  children?: React.ReactNode
  gap?: "sm" | "md" | "lg"
  columns?: 1 | 2 | 3 | 4 | 5 | 6
}

const bentoGridVariants = cva(
  "grid grid-cols-1",
  {
    variants: {
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
      },
      columns: {
        1: "md:grid-cols-1",
        2: "md:grid-cols-2",
        3: "md:grid-cols-2 lg:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-4",
        5: "md:grid-cols-3 lg:grid-cols-5",
        6: "md:grid-cols-3 lg:grid-cols-6",
      },
    },
    defaultVariants: {
      gap: "md",
      columns: 3,
    },
  }
)

export interface BentoCardProps {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  icon?: React.ReactNode
  header?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  scale?: number
  rotate?: number
  children?: React.ReactNode
  hoverEffect?: "none" | "scale" | "border" | "shadow" | "slide"
  aspectRatio?: "auto" | "square" | "video" | "wide"
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2 | 3
}

const bentoCardVariants = cva(
  "rounded-xl group/bento transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
  {
    variants: {
      hoverEffect: {
        none: "",
        scale: "hover:scale-[1.02]",
        border: "hover:border-primary/50",
        shadow: "hover:shadow-lg",
        slide: "hover:-translate-y-1",
      },
      aspectRatio: {
        auto: "",
        square: "aspect-square",
        video: "aspect-video",
        wide: "aspect-[2/1]",
      },
      colSpan: {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-3",
      },
      rowSpan: {
        1: "row-span-1",
        2: "row-span-1 md:row-span-2",
        3: "row-span-1 md:row-span-3",
      },
    },
    defaultVariants: {
      hoverEffect: "none",
      aspectRatio: "auto",
      colSpan: 1,
      rowSpan: 1,
    },
  }
)

export function BentoGrid({ 
  className, 
  children, 
  gap, 
  columns 
}: BentoGridProps) {
  return (
    <div className={cn(bentoGridVariants({ gap, columns }), className)}>
      {children}
    </div>
  )
}

export function BentoCard({
  className,
  title,
  description,
  icon,
  header,
  content,
  footer,
  scale = 1,
  rotate = 0,
  children,
  hoverEffect,
  aspectRatio,
  colSpan,
  rowSpan,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        bentoCardVariants({ hoverEffect, aspectRatio, colSpan, rowSpan }),
        className
      )}
      style={{
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      {header && (
        <div className="mb-2">{header}</div>
      )}
      
      {(title || description || icon) && (
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          {icon && <div className="mb-2">{icon}</div>}
          {title && <h3 className="font-semibold text-primary mt-1 mb-2">{title}</h3>}
          {description && (
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      )}
      
      {content && (
        <div className="flex-grow">{content}</div>
      )}
      
      {children && (
        <div className="flex-grow">{children}</div>
      )}
      
      {footer && (
        <div className="mt-auto pt-4">{footer}</div>
      )}
    </div>
  )
}
