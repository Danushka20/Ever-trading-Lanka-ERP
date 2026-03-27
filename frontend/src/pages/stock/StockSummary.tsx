import { useMemo } from "react"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBItem } from "@/lib/types"
import { StockSummaryHeader } from "@/components/stock/summary/StockSummaryHeader"
import { StockSummaryKpiCards } from "@/components/stock/summary/StockSummaryKpiCards"
import { StockSummaryTables } from "@/components/stock/summary/StockSummaryTables"

export default function StockSummary() {
  const { data: items, isLoading: itemsLoading } = useOfflineData<DBItem>("items")

  const formatCurrency = (value: number) => `Rs.${value.toLocaleString()}`

  const summary = useMemo(() => {
    return items.map(item => ({
      item_id: item.id,
      total_stock: Number(item.total_stock || 0),
      reorder_level: item.reorder_level || 50,
      cost_price: Number(item.buy_price || 0),
      selling_price: Number(item.unit_price || 0),
      product: { id: item.id, name: item.name }
    }))
  }, [items])

  const totalItems = useMemo(() => summary.reduce((sum, s) => sum + Number(s.total_stock || 0), 0), [summary])
  const totalCostValue = useMemo(() => summary.reduce((sum, s) => sum + (s.total_stock * s.cost_price), 0), [summary])
  const totalSalesValue = useMemo(() => summary.reduce((sum, s) => sum + (s.total_stock * s.selling_price), 0), [summary])
  const totalPotentialProfit = useMemo(() => totalSalesValue - totalCostValue, [totalSalesValue, totalCostValue])

  const lowStock = useMemo(() => summary.filter(s => s.total_stock < s.reorder_level), [summary])
  const profitItems = useMemo(() => summary.filter(s => s.total_stock > 0 && s.selling_price > s.cost_price).length, [summary])
  const lossItems = useMemo(() => summary.filter(s => s.total_stock > 0 && s.selling_price < s.cost_price).length, [summary])

  const reportRows = useMemo(() => {
    return summary.map((item) => {
      const costValue = item.total_stock * item.cost_price
      const salesValue = item.total_stock * item.selling_price
      const profitOrLoss = salesValue - costValue

      return {
        product: item.product.name,
        stock: item.total_stock,
        reorder_level: item.reorder_level,
        cost_price: formatCurrency(item.cost_price),
        selling_price: formatCurrency(item.selling_price),
        cost_value: formatCurrency(costValue),
        sales_value: formatCurrency(salesValue),
        profit_or_loss: formatCurrency(profitOrLoss),
        status: profitOrLoss < 0 ? "Loss" : "Profit",
      }
    })
  }, [summary])

  if (itemsLoading) {
    return <div className="flex items-center justify-center flex-1 p-8">Loading stock summary...</div>
  }
  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      <StockSummaryHeader reportRows={reportRows} />
      <StockSummaryKpiCards
        totalItems={totalItems}
        summaryCount={summary.length}
        totalCostValue={totalCostValue}
        lowStockCount={lowStock.length}
        totalPotentialProfit={totalPotentialProfit}
        profitItems={profitItems}
        lossItems={lossItems}
        formatCurrency={formatCurrency}
      />
      <StockSummaryTables summary={summary} lowStock={lowStock} formatCurrency={formatCurrency} />
    </div>
  )
}
