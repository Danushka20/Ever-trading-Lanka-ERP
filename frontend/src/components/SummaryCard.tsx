import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    positive: boolean
  }
  color?: "blue" | "green" | "amber" | "red" | "purple"
}

export function SummaryCard({ title, value, icon: Icon, description, trend, color = "blue" }: SummaryCardProps) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase text-slate-500 tracking-wider">
          {title}
        </CardTitle>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", colorMap[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center pt-1 text-xs font-medium">
            {trend ? (
              <span className={trend.positive ? "text-green-600" : "text-red-600"}>
                {trend.positive ? "↑" : "↓"} {trend.value}%
                <span className="text-slate-400 ml-1">vs last period</span>
              </span>
            ) : (
              <span className="text-slate-400">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
