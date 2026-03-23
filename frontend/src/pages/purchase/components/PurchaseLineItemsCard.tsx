import { Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DBItem } from "@/lib/types"
import type { PurchaseItemInput } from "../types"

interface PurchaseLineItemsCardProps {
  itemsList: DBItem[]
  currentItem: PurchaseItemInput
  formItems: PurchaseItemInput[]
  onCurrentItemChange: (item: PurchaseItemInput) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
  onUpdateLinePrice: (index: number, field: "unit_price" | "selling_price", price: number) => void
}

export function PurchaseLineItemsCard({
  itemsList,
  currentItem,
  formItems,
  onCurrentItemChange,
  onAddItem,
  onRemoveItem,
  onUpdateLinePrice,
}: PurchaseLineItemsCardProps) {
  const selectedItem = itemsList.find((item) => item.id.toString() === currentItem.item_id)

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
        <CardTitle>Line Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 bg-slate-50/80 border-b">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-2 space-y-2">
              <Label>Select Product</Label>
              <Select
                value={currentItem.item_id}
                onValueChange={(value) => {
                  const selectedItem = itemsList.find((item) => item.id.toString() === value)
                  onCurrentItemChange({
                    ...currentItem,
                    item_id: value,
                    unit_price: selectedItem?.buy_price ?? 0,
                    selling_price: selectedItem?.unit_price ?? 0,
                  })
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {itemsList.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Code: {item.sku || 'N/A'}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Item Code</Label>
              <Input
                placeholder="Auto-filled"
                className="bg-white"
                value={selectedItem?.sku || ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Price</Label>
              <Input
                type="number"
                className="bg-white"
                value={currentItem.unit_price}
                onChange={(e) =>
                  onCurrentItemChange({ ...currentItem, unit_price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Selling Price</Label>
              <Input
                type="number"
                className="bg-white"
                value={Number(currentItem.selling_price || 0)}
                onChange={(e) =>
                  onCurrentItemChange({ ...currentItem, selling_price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Qty</Label>
              <Input
                type="number"
                className="bg-white text-center"
                value={currentItem.quantity}
                onChange={(e) => onCurrentItemChange({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Avail. Stock</Label>
              <div className={`h-10 px-3 flex items-center justify-center rounded-md border font-bold text-sm ${Number(selectedItem?.total_stock || 0) <= (selectedItem?.reorder_level || 0) ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}>
                {Number(selectedItem?.total_stock || 0)}
              </div>
            </div>
            <Button type="button" onClick={onAddItem} className="bg-blue-600 hover:bg-blue-700 h-10 shadow-sm mt-auto">
              <Plus className="w-4 h-4 mr-1 ml-4" /> Add Item
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-500">
            <TableRow>
              <TableHead className="pl-6">Product</TableHead>
              <TableHead>Item Code</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Selling Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formItems.map((item, index) => (
              <TableRow key={index} className="hover:bg-slate-50/50">
                <TableCell className="pl-6 font-medium">{itemsList.find((product) => product.id.toString() === item.item_id)?.name}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs">{itemsList.find((product) => product.id.toString() === item.item_id)?.sku || "-"}</span>
                </TableCell>
                <TableCell className="text-center font-bold">{item.quantity}</TableCell>
                <TableCell className="text-right text-xs">
                  <Input
                    type="number"
                    className="w-20 ml-auto h-7 text-right"
                    value={item.unit_price}
                    onChange={(e) => onUpdateLinePrice(index, "unit_price", parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell className="text-right text-xs">
                  <Input
                    type="number"
                    className="w-20 ml-auto h-7 text-right"
                    value={item.selling_price}
                    onChange={(e) => onUpdateLinePrice(index, "selling_price", parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell className="font-bold text-right text-blue-600">
                  Rs.{(item.quantity * item.unit_price).toLocaleString()}
                </TableCell>
                <TableCell className="pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                    className="h-8 w-8 text-slate-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {formItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center opacity-30">
                    <ShoppingCart className="h-10 w-10 mb-2" />
                    <p className="text-sm font-medium">Cart is empty. Add products above.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
