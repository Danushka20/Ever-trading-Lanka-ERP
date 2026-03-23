import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ProfitReport() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profit Report</h2>
      </div>
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Margin Analysis</CardTitle>
          <CardDescription>Understand your business profitability.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground font-medium">
             Profit analysis tools coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
