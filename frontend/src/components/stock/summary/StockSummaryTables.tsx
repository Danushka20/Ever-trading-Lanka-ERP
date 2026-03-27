import { useEffect, useMemo, useState } from "react"
import { Activity, AlertTriangle, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SummaryItem {
  item_id: number
  total_stock: number
  reorder_level: number
  cost_price: number
  selling_price: number
  product: {
    id: number
    name: string
  }
}

interface StockSummaryTablesProps {
  summary: SummaryItem[]
  lowStock: SummaryItem[]
  formatCurrency: (value: number) => string
}

export function StockSummaryTables({ summary, lowStock, formatCurrency }: StockSummaryTablesProps) {
  const [topPage, setTopPage] = useState(1)
  const [topPageSize, setTopPageSize] = useState(5)
  const [lowStockPage, setLowStockPage] = useState(1)
  const [lowStockPageSize, setLowStockPageSize] = useState(5)

  const topProfitabilityRows = useMemo(() => {
    return [...summary].sort(
      (a, b) => (b.total_stock * (b.selling_price - b.cost_price)) - (a.total_stock * (a.selling_price - a.cost_price))
    )
  }, [summary])

  const topTotalPages = Math.max(1, Math.ceil(topProfitabilityRows.length / topPageSize))
  const topPaginatedRows = useMemo(() => {
    const start = (topPage - 1) * topPageSize
    return topProfitabilityRows.slice(start, start + topPageSize)
  }, [topProfitabilityRows, topPage, topPageSize])

  const lowStockTotalPages = Math.max(1, Math.ceil(lowStock.length / lowStockPageSize))
  const lowStockPaginatedRows = useMemo(() => {
    const start = (lowStockPage - 1) * lowStockPageSize
    return lowStock.slice(start, start + lowStockPageSize)
  }, [lowStock, lowStockPage, lowStockPageSize])

  useEffect(() => {
    setTopPage(1)
  }, [topPageSize, topProfitabilityRows.length])

  useEffect(() => {
    setLowStockPage(1)
  }, [lowStockPageSize, lowStock.length])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Top Stock Profitability Items
              </CardTitle>
              <CardDescription>Stock value and potential profit/loss by product</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Cost Value</TableHead>
                <TableHead className="text-right">Sales Value</TableHead>
                <TableHead className="text-right">P/L</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPaginatedRows.map((item) => {
                const costValue = item.total_stock * item.cost_price
                const salesValue = item.total_stock * item.selling_price
                const profitOrLoss = salesValue - costValue
                return (
                  <TableRow key={item.item_id}>
                    <TableCell className="font-medium text-slate-700">{item.product.name}</TableCell>
                    <TableCell className="font-mono text-xs text-right">{item.total_stock}</TableCell>
                    <TableCell className="font-mono text-xs text-right">{formatCurrency(costValue)}</TableCell>
                    <TableCell className="font-mono text-xs text-right">{formatCurrency(salesValue)}</TableCell>
                    <TableCell className={`text-right font-mono text-xs font-bold ${profitOrLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatCurrency(profitOrLoss)}
                    </TableCell>
                    <TableCell className="text-right">
                      {profitOrLoss < 0 ? (
                        <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">Loss</Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Profit</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {topProfitabilityRows.length > 0 && (
            <div className="pt-4">
              <Pagination
                currentPage={topPage}
                totalPages={topTotalPages}
                totalItems={topProfitabilityRows.length}
                pageSize={topPageSize}
                onPageChange={setTopPage}
                onPageSizeChange={setTopPageSize}
                pageSizeOptions={[5, 10, 25]}
                showPageSize={true}
                showTotal={true}
                showFirstLast={true}
                variant="default"
                className="border rounded-2xl border-slate-200"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Items running low on stock</CardDescription>
            </div>
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
              {lowStock.length} Alert{lowStock.length !== 1 && "s"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="p-3 mb-3 rounded-full bg-emerald-100">
                <Activity className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="font-medium text-emerald-900">Stock levels are healthy</p>
              <p className="text-sm text-emerald-600">No items are currently running low.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Reorder</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockPaginatedRows.map((item) => (
                    <TableRow key={item.item_id}>
                      <TableCell className="font-medium text-slate-700">{item.product.name}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-right text-amber-600">{item.total_stock}</TableCell>
                      <TableCell className="font-mono text-xs text-right text-muted-foreground">{item.reorder_level}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">Restock</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="pt-4">
                <Pagination
                  currentPage={lowStockPage}
                  totalPages={lowStockTotalPages}
                  totalItems={lowStock.length}
                  pageSize={lowStockPageSize}
                  onPageChange={setLowStockPage}
                  onPageSizeChange={setLowStockPageSize}
                  pageSizeOptions={[5, 10, 25]}
                  showPageSize={true}
                  showTotal={true}
                  showFirstLast={true}
                  variant="default"
                  className="border rounded-2xl border-slate-200"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
