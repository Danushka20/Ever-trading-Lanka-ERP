import { Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { RowActionMenu } from "@/components/ui/action-menu"
import type { DBItem } from "@/lib/types"

interface ItemsTableCardProps {
  items: DBItem[]
  searchQuery: string
  categoryFilter: string
  onAddItem: () => void
  onEdit: (item: DBItem) => void
  onDeleteRequest: (id: number) => void
}

export function ItemsTableCard({
  items,
  searchQuery,
  categoryFilter,
  onAddItem,
  onEdit,
  onDeleteRequest,
}: ItemsTableCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {items.length === 0 ? (
          <EmptyState
            variant={searchQuery || categoryFilter !== "all" ? "search" : "default"}
            title="No items found"
            description={searchQuery || categoryFilter !== "all" ? "Try adjusting your filters" : "Add your first inventory item"}
            action={{ label: "Add Item", onClick: onAddItem }}
          />
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Item Category</TableHead>
                <TableHead className="font-semibold">Item Code</TableHead>
                <TableHead className="font-semibold text-right">Reorder Level</TableHead>
                <TableHead className="font-semibold text-right">Unit Price</TableHead>
                <TableHead className="font-semibold text-right">Selling Price</TableHead>
                <TableHead className="w-14"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        {item.unit && <p className="text-xs text-slate-500">{item.unit.name}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.category ? (
                      <Badge variant="secondary" className="bg-slate-100">{item.category.name}</Badge>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600">{item.sku || "-"}</TableCell>
                  <TableCell className="font-semibold text-right text-slate-700">
                    {Number(item.reorder_level || 0)}
                  </TableCell>
                  <TableCell className="font-semibold text-right text-slate-700">
                    Rs.{Number(item.buy_price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-semibold text-right text-slate-700">
                    Rs.{Number(item.unit_price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <RowActionMenu
                      actions={[
                        { label: "Edit", onClick: () => onEdit(item) },
                        { label: "Delete", onClick: () => onDeleteRequest(item.id), variant: "danger" },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
