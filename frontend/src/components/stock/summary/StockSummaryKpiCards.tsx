import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StockSummaryKpiCardsProps {
  totalItems: number
  summaryCount: number
  totalCostValue: number
  lowStockCount: number
  totalPotentialProfit: number
  profitItems: number
  lossItems: number
  formatCurrency: (value: number) => string
}

export function StockSummaryKpiCards({
  totalItems,
  summaryCount,
  totalCostValue,
  lowStockCount,
  totalPotentialProfit,
  profitItems,
  lossItems,
  formatCurrency,
}: StockSummaryKpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden border-none shadow-sm bg-linear-to-br from-blue-50 to-blue-100/50">
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/30" />
        <CardContent className="p-6">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Stock Items</p>
              <p className="text-3xl font-bold text-blue-700">{totalItems.toLocaleString()}</p>
              <p className="mt-1 text-xs text-blue-500">{summaryCount} unique products</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Package className="text-blue-600 h-7 w-7" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-none shadow-sm bg-linear-to-br from-emerald-50 to-emerald-100/50">
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/30" />
        <CardContent className="p-6">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Stock Cost Value</p>
              <p className="text-3xl font-bold text-emerald-700">{formatCurrency(totalCostValue)}</p>
              <p className="mt-1 text-xs text-emerald-500">Total at cost price</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <DollarSign className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-none shadow-sm bg-linear-to-br from-amber-50 to-amber-100/50">
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/30" />
        <CardContent className="p-6">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-amber-700">{lowStockCount}</p>
              <p className="mt-1 text-xs text-amber-500">Below Reorder Level</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-none shadow-sm bg-linear-to-br from-violet-50 to-violet-100/50">
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200/30" />
        <CardContent className="p-6">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-violet-600">Potential Profit/Loss</p>
              <p className={`text-3xl font-bold ${totalPotentialProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                {formatCurrency(totalPotentialProfit)}
              </p>
              <p className="mt-1 text-xs text-violet-500">{profitItems} profit items | {lossItems} loss items</p>
            </div>
            <div className="p-3 rounded-xl bg-violet-500/10">
              <TrendingUp className="h-7 w-7 text-violet-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
