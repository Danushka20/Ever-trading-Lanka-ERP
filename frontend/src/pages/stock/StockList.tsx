import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBStockBatch, DBItem } from "@/lib/types"

export default function StockList() {
  const { data: stock, isLoading: loading } = useOfflineData<DBStockBatch>("stockBatches")
  const { data: items } = useOfflineData<DBItem>("items")
  const [searchQuery, setSearchQuery] = useState("")

  const isExpired = (date: string | null) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  const isExpiringSoon = (date: string | null) => {
    if (!date) return false
    const expiry = new Date(date)
    const today = new Date()
    const diff = expiry.getTime() - today.getTime()
    const days = diff / (1000 * 60 * 60 * 24)
    return days > 0 && days < 90 // Within 3 months
  }

  const aggregatedStock = useMemo(() => {
    // 1. Group all available batches by item_id
    const groupedBatches: Record<number, any[]> = {};
    stock.forEach(s => {
      const itemId = Number(s.item_id);
      if (!groupedBatches[itemId]) groupedBatches[itemId] = [];
      groupedBatches[itemId].push(s);
    });

    // 2. Map every item to its summarized stock data
    return items.map(item => {
      const itemBatches = groupedBatches[item.id] || [];
      const total_quantity = itemBatches.reduce((sum, b) => sum + Number(b.remaining_quantity || b.quantity || 0), 0);
      
      return {
        item_id: item.id,
        item: item,
        total_quantity: total_quantity,
        item_code: item.sku || 'N/A',
        category: (item as any).category?.name || 'Uncategorized'
      };
    });
  }, [stock, items])

  const filteredStock = useMemo(() => {
    return aggregatedStock.filter((s) =>
        s.item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.item_code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [aggregatedStock, searchQuery])

  return (
    <div className="flex-1 p-8 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Stock Summary</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory Levels</CardTitle>
          <CardDescription>View consolidated stock levels for each product across all batches.</CardDescription>
          <div className="flex items-center pt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                placeholder="Search product/code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-50">Loading stock data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Total Stock</TableHead>
                  <TableHead className="text-right">Unit Price (Buy)</TableHead>
                  <TableHead className="text-right">Selling Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No stock records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStock.map((s) => (
                    <TableRow key={s.item_id}>
                      <TableCell className="font-mono text-xs">{s.item_code}</TableCell>
                      <TableCell className="font-medium">{s.item?.name || 'Unknown'}</TableCell>
                      <TableCell>{s.category}</TableCell>
                      <TableCell className={`text-right font-bold ${s.total_quantity <= (s.item?.reorder_level || 0) ? 'text-red-600' : 'text-emerald-600'}`}>
                        {Number(s.total_quantity).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-right text-muted-foreground">
                        Rs.{Number(s.item?.buy_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="font-mono text-lg font-bold text-right text-blue-600">
                        Rs.{Number(s.item?.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
