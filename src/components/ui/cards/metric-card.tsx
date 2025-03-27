
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    positive: boolean
  }
}

export function MetricCard({ title, value, icon, description, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.positive ? '+' : '-'}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DemoMetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value="$45,231.89"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        description="+20.1% from last month"
      />
      <MetricCard
        title="Subscriptions"
        value="+2350"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="+180.1% from last month"
      />
      <MetricCard
        title="Sales"
        value="+12,234"
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        description="+19% from last month"
      />
      <MetricCard
        title="Active Now"
        value="+573"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        description="+201 since last hour"
      />
    </div>
  )
}
