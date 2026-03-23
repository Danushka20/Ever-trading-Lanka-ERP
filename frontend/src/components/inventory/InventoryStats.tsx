import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"

export function InventoryStats() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardDescription>Total Items</CardDescription>
          <CardTitle className="text-2xl font-bold">1,284</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardDescription>Total Value</CardDescription>
          <CardTitle className="text-2xl font-bold">$12,450.00</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border-none shadow-sm bg-amber-50/50">
        <CardHeader className="pb-2">
          <CardDescription className="text-amber-700 font-medium">Attention Required</CardDescription>
          <CardTitle className="text-2xl font-bold text-amber-900">12 Items Low</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
