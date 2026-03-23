import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SalesReport() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales Report</h2>
      </div>
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Detailed breakdown of sales performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-50 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground font-medium">
             Analytics engine coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
