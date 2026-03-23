import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Package, Search, MoreHorizontal, ArrowUpDown } from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category?: { name: string }
  total_stock: number
  unit_price: number | string
  batches?: any[]
}

interface InventoryTableProps {
  items: InventoryItem[]
}

const getStatusBadge = (stock: number) => {
  if (stock <= 0) return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 uppercase text-[10px] font-bold">Out of Stock</Badge>
  if (stock < 10) return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 uppercase text-[10px] font-bold">Low Stock</Badge>
  return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 uppercase text-[10px] font-bold">In Stock</Badge>
}

export function InventoryTable({ items }: InventoryTableProps) {
  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg">Product Inventory</CardTitle>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8 bg-slate-50/50 border-none h-10 ring-offset-transparent"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="pl-6">Product & Category</TableHead>
              <TableHead>Batches</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors">
                  Stock
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight mt-0.5">{item.category?.name || 'General'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {item.batches && item.batches.length > 0 ? (
                        item.batches.map((b, i) => (
                            <code key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700">
                                {b.batch_no}
                            </code>
                        ))
                    ) : (
                        <span className="text-slate-400 text-xs">No batches</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-900">{item.total_stock}</span>
                </TableCell>
                <TableCell className="font-medium text-blue-600">Rs.{item.unit_price}</TableCell>
                <TableCell>{getStatusBadge(item.total_stock)}</TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t border-slate-100 flex items-center justify-center">
          <Button variant="ghost" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            View Detailed Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
