import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, TrendingUp } from "lucide-react"

interface TargetStatsProps {
  stats: {
    overallAchievement: number
    totalTarget: number
    totalAchieved: number
    topPerformance: number
  }
}

export function TargetStats({ stats }: TargetStatsProps) {
  const formatCurrency = (val: number) => `Rs.${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardDescription>Overall Achievement</CardDescription>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.overallAchievement}%</div>
          <Progress value={stats.overallAchievement} className="h-2 mt-4" />
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardDescription>Total Target</CardDescription>
          <Target className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalTarget)}</div>
          <p className="text-xs text-slate-500 mt-2">Annual target amount</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardDescription>Total Achieved</CardDescription>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalAchieved)}</div>
          <p className="text-xs text-slate-500 mt-2">Total sales achieved</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardDescription>Peak Performance</CardDescription>
          <Trophy className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.topPerformance}%</div>
          <p className="text-xs text-slate-500 mt-2">Best month performance</p>
        </CardContent>
      </Card>
    </div>
  )
}
