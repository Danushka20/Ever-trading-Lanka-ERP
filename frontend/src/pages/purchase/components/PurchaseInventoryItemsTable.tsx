import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { DBItem } from "@/lib/types"

interface PurchaseInventoryItemsTableProps {
  items: DBItem[]
}

const getStockStatus = (stock: number, reorderLevel: number) => {
  if (stock <= 0) {
    return <Badge className="bg-rose-100 text-rose-700 border-none">Out</Badge>
  }

  if (stock <= reorderLevel) {
    return <Badge className="bg-amber-100 text-amber-700 border-none">Low</Badge>
  }

  return <Badge className="bg-emerald-100 text-emerald-700 border-none">In</Badge>
}

export function PurchaseInventoryItemsTable({ items }: PurchaseInventoryItemsTableProps) {
  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-white border-b">
        <CardTitle>Inventory Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="pl-6">Product</TableHead>
              <TableHead>Item Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Buy Price</TableHead>
              <TableHead className="text-right">Selling Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="pr-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                  No inventory items found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const stock = Number(item.total_stock || 0)
                const reorderLevel = Number(item.reorder_level || 0)

                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 font-semibold">{item.name}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{item.sku || `ITEM-${item.id}`}</span>
                    </TableCell>
                    <TableCell>{item.category?.name || "General"}</TableCell>
                    <TableCell className="text-right">Rs.{Number(item.buy_price || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right">Rs.{Number(item.unit_price || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">{stock}</TableCell>
                    <TableCell className="pr-6 text-right">{getStockStatus(stock, reorderLevel)}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
