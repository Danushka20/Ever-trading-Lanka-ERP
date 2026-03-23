import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ChartData {
  month: string
  target: number
  actual: number
  achievement: number
}

interface TargetTableProps {
  data: ChartData[]
}

export function TargetTable({ data }: TargetTableProps) {
  const formatCurrency = (val: number) => `Rs.${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Monthly Performance Details</CardTitle>
        <CardDescription>Detailed breakdown of target vs actual for each month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 font-bold text-slate-700">Month</th>
                <th className="text-right py-3 px-4 font-bold text-slate-700">Target (Rs.)</th>
                <th className="text-right py-3 px-4 font-bold text-slate-700">Actual (Rs.)</th>
                <th className="text-right py-3 px-4 font-bold text-slate-700">Achievement %</th>
                <th className="text-right py-3 px-4 font-bold text-slate-700">Variance (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const variance = row.actual - row.target
                const isPositive = variance >= 0
                return (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700">{row.month}</td>
                    <td className="text-right py-3 px-4 text-slate-600">{formatCurrency(row.target)}</td>
                    <td className="text-right py-3 px-4 text-slate-600">{formatCurrency(row.actual)}</td>
                    <td className="text-right py-3 px-4">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        row.achievement >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {row.achievement}%
                      </span>
                    </td>
                    <td className={`text-right py-3 px-4 font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{formatCurrency(variance)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
