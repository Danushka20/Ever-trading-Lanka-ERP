import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementCardProps {
  label: string
  target: string | number
  achieved: string | number
  percentage: number
  icon?: "target" | "trophy" | "growth"
}

export function AchievementCard({ label, target, achieved, percentage, icon = "target" }: AchievementCardProps) {
  const Icon = icon === "trophy" ? Trophy : icon === "growth" ? TrendingUp : Target
  const color = percentage >= 100 ? "text-green-600 bg-green-50" : percentage >= 75 ? "text-blue-600 bg-blue-50" : "text-amber-600 bg-amber-50"

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-slate-500">
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-black text-slate-900">{achieved}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Target: {target}</div>
          </div>
          <div className={cn("text-lg font-black", percentage >= 100 ? "text-green-600" : "text-slate-900")}>
            {percentage}%
          </div>
        </div>
        <Progress value={percentage} className="h-2" />
      </CardContent>
    </Card>
  )
}
