import { useMemo } from "react"
import { Package, TrendingUp, AlertTriangle, DollarSign, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBItem } from "@/lib/types"

export default function StockSummary() {
  const { data: items, isLoading: itemsLoading } = useOfflineData<DBItem>("items")

  const summary = useMemo(() => {
    return items.map(item => ({
      item_id: item.id,
      total_stock: item.total_stock || 0,
      avg_price: item.unit_price || 0, // Using unit_price as proxy
      product: { id: item.id, name: item.name }
    }))
  }, [items])

  const totalItems = useMemo(() => summary.reduce((sum, s) => sum + s.total_stock, 0), [summary])
  const totalValue = useMemo(() => items.reduce((sum, item) => sum + ((item.total_stock || 0) * (item.unit_price || 0)), 0), [items])

  const lowStock = useMemo(() => summary.filter(s => s.total_stock < 50), [summary])

  if (itemsLoading) {
    return <div className="flex items-center justify-center flex-1 p-8">Loading stock summary...</div>
  }
  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Stock Summary</h2>
        <p className="text-muted-foreground">High-level overview of inventory performance and valuation.</p>
      </div>
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-none shadow-sm bg-linear-to-br from-blue-50 to-blue-100/50">
          <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/30" />
          <CardContent className="p-6">
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Stock Items</p>
                <p className="text-3xl font-bold text-blue-700">{totalItems.toLocaleString()}</p>
                <p className="mt-1 text-xs text-blue-500">{summary.length} unique products</p>
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
                <p className="text-sm font-medium text-emerald-600">Total Inventory Value</p>
                <p className="text-3xl font-bold text-emerald-700">Rs.{totalValue.toLocaleString()}</p>
                <p className="mt-1 text-xs text-emerald-500">Estimated value</p>
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
                <p className="text-3xl font-bold text-amber-700">{lowStock.length}</p>
                <p className="mt-1 text-xs text-amber-500">Below Reorder Level</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Top Stock Value Items
                </CardTitle>
                <CardDescription>Items contributing most to inventory value</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary
                  .sort((a, b) => (b.total_stock * b.avg_price) - (a.total_stock * a.avg_price))
                  .slice(0, 5)
                  .map((item) => {
                    const value = item.total_stock * item.avg_price
                    const share = totalValue > 0 ? (value / totalValue) * 100 : 0
                    return (
                      <TableRow key={item.item_id}>
                        <TableCell className="font-medium text-slate-700">{item.product.name}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{item.total_stock}</TableCell>
                        <TableCell className="text-right font-mono text-xs">Rs.{value.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                             <span className="text-xs text-muted-foreground">{share.toFixed(1)}%</span>
                             <Progress value={share} className="h-1.5 w-12 bg-slate-100" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
             <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Items running low on stock</CardDescription>
              </div>
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                {lowStock.length} Alert{lowStock.length !== 1 && 's'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-10 text-center">
                 <div className="p-3 mb-3 bg-emerald-100 rounded-full">
                    <Activity className="w-6 h-6 text-emerald-600" />
                 </div>
                 <p className="font-medium text-emerald-900">Stock levels are healthy</p>
                 <p className="text-sm text-emerald-600">No items are currently running low.</p>
               </div>
            ) : (
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
                    {lowStock.slice(0, 5).map((item) => (
                      <TableRow key={item.item_id}>
                        <TableCell className="font-medium text-slate-700">{item.product.name}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-amber-600 font-bold">{item.total_stock}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">50</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">Restock</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
