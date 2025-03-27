
import * as React from "react"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/ui/UserAvatar"

export interface AvatarCirclesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    name?: string
    initials?: string
    src?: string
    status?: "online" | "away" | "busy" | "offline"
    role?: string
  }[]
  limit?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}

export function AvatarCircles({
  items = [],
  limit = 3,
  size = "sm",
  className,
  ...props
}: AvatarCirclesProps) {
  const displayItems = items.slice(0, limit)
  const extraItems = Math.max(0, items.length - limit)

  return (
    <div
      className={cn("flex -space-x-2 overflow-hidden", className)}
      {...props}
    >
      {displayItems.map((item, index) => (
        <UserAvatar
          key={index}
          src={item.src}
          name={item.name}
          initials={item.initials}
          status={item.status}
          size={size}
          showTooltip={true}
          tooltipContent={item.name || item.role || "Team member"}
          className="border-2 border-background"
          colorScheme="primary"
        />
      ))}
      {extraItems > 0 && (
        <UserAvatar
          size={size}
          className="border-2 border-background bg-muted"
          initials={`+${extraItems}`}
          showTooltip={true}
          tooltipContent={`${extraItems} more team members`}
        />
      )}
    </div>
  )
}
