
import * as React from "react"
import { cn } from "@/lib/utils"

export interface BentoGridProps {
  className?: string
  children?: React.ReactNode
}

export interface BentoCardProps {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  icon?: React.ReactNode
  header?: React.ReactNode
  content?: React.ReactNode
  scale?: number
  rotate?: number
  children?: React.ReactNode
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
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
  scale = 1,
  rotate = 0,
  children,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
      style={{
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      {header ? header : null}
      {(title || description || icon) && (
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          {icon}
          {title && <h3 className="font-semibold text-primary mt-4 mb-2">{title}</h3>}
          {description && (
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      )}
      {content || children ? (
        <div className="flex flex-col h-full justify-between">
          <div>
            {content}
            {children}
          </div>
        </div>
      ) : null}
    </div>
  )
}
