
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentSale {
  name: string
  email: string
  amount: string
  image?: string
}

interface RecentSalesProps {
  data: RecentSale[]
}

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {data.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            {sale.image ? (
              <AvatarImage src={sale.image} alt={sale.name} />
            ) : (
              <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  )
}
