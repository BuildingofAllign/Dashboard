
import { Bar } from "@/components/ui/bar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ActivityGoalProps {
  title: string
  description: string
  completed: number
  data: { day: string; value: number }[]
  target: number
}

export function ActivityGoal({
  title,
  description,
  completed,
  data,
  target,
}: ActivityGoalProps) {
  const progress = Math.round((completed / target) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{completed}</span>
            <span className="text-muted-foreground">
              <span className="text-xs text-muted-foreground">/{target}</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground">{progress}% completed</div>
        </div>
        <div className="mt-4 h-2 w-full">
          <Bar value={progress} className="h-2 w-full bg-secondary" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          {data.map((day) => (
            <div
              key={day.day}
              className="flex h-20 w-full flex-col items-center gap-1"
            >
              <div className="h-14 w-full">
                <div
                  className="rounded-sm bg-primary"
                  style={{
                    height: `${(day.value / target) * 100}%`,
                    width: "100%",
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">{day.day}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          <span className="mx-auto">View activity</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
