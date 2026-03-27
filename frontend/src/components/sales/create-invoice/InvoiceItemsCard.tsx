import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, ShoppingCart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DBItem } from "@/lib/types"
import type { InvoiceItemRow } from "./types"
import { useState, useMemo } from "react"

interface InvoiceItemsCardProps {
  invoiceItems: InvoiceItemRow[]
  inStockItems: DBItem[]
  onAddItem: (item: InvoiceItemRow) => void
  onRemoveItem: (index: number) => void
  onUpdateItemRow: (index: number, field: keyof InvoiceItemRow, value: string | number) => void
  getMaxRowQty: (itemId: string, rowIndex?: number) => number
}

export function InvoiceItemsCard({
  invoiceItems,
  inStockItems,
  onAddItem,
  onRemoveItem,
  onUpdateItemRow,
  getMaxRowQty,
}: InvoiceItemsCardProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>("")
  const [selectedQty, setSelectedQty] = useState<number>(1)

  const selectedItem = useMemo(() => 
    inStockItems.find(i => i.id.toString() === selectedItemId),
    [inStockItems, selectedItemId]
  )

  const maxAvailable = useMemo(() => 
    selectedItemId ? getMaxRowQty(selectedItemId) : 0,
    [selectedItemId, getMaxRowQty, invoiceItems]
  )

  const handleAddClick = () => {
    if (!selectedItem) return
    
    onAddItem({
      item_id: selectedItemId,
      qty: Math.min(selectedQty, maxAvailable),
      unit_price: Number(selectedItem.unit_price || 0),
      total: Math.min(selectedQty, maxAvailable) * Number(selectedItem.unit_price || 0),
      description: selectedItem.description || ""
    })

    setSelectedItemId("")
    setSelectedQty(1)
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-slate-800">Invoice Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-y border-slate-100">
              <TableHead className="w-[45%] text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Item Description</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider text-center uppercase text-slate-500">Available</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider text-center uppercase text-slate-500">Qty</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider text-right uppercase text-slate-500">Unit Price</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider text-right uppercase text-slate-500">Total</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceItems.map((row, idx) => {
              const item = inStockItems.find(i => i.id.toString() === row.item_id)
              return (
                <TableRow key={idx} className="border-b border-slate-50 hover:bg-slate-50/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{item?.name || "Unknown Item"}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item?.sku && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">CODE: {item.sku}</span>}
                        {row.description && <span className="text-[11px] text-slate-400 italic truncate max-w-[250px]">{row.description}</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-sm font-bold ${
                      getMaxRowQty(row.item_id, idx) <= 5 ? 'text-red-500' : 'text-slate-500'
                    }`}>
                      {Number(getMaxRowQty(row.item_id, idx)).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Input
                        type="number"
                        min="1"
                        max={getMaxRowQty(row.item_id, idx)}
                        value={row.qty}
                        onChange={e => onUpdateItemRow(idx, "qty", parseInt(e.target.value) || 0)}
                        className="w-20 h-8 font-bold text-center text-slate-800 border-slate-200 focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <div className="relative w-32">
                        <span className="absolute text-[10px] font-bold left-2 top-1/2 -translate-y-1/2 text-slate-400">Rs.</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={row.unit_price}
                          onChange={e => onUpdateItemRow(idx, "unit_price", parseFloat(e.target.value) || 0)}
                          className="h-8 pl-8 font-bold text-right text-slate-800 border-slate-200 focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-black text-right text-blue-600">
                    Rs. {Number(row.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(idx)}
                      className="text-slate-300 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {invoiceItems.length === 0 && (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400">No items added to the invoice yet.</p>
          </div>
        )}

        {/* Quick Add Section at the bottom */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[300px] space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 ml-1">Select Item to Add</label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger className="w-full h-11 bg-white border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Search by name or SKU..." />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  {inStockItems.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()} className="py-2.5 px-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-blue-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          {item.sku && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">SKU: {item.sku}</span>}
                          <span className="text-[11px] text-slate-400 italic">Available: {getMaxRowQty(item.id.toString())}</span>
                          <span className="text-[11px] font-bold text-slate-600">Rs. {Number(item.unit_price).toLocaleString()}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-24 space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 ml-1">Qty</label>
              <Input
                type="number"
                min="1"
                max={maxAvailable}
                value={selectedQty}
                onChange={e => setSelectedQty(parseInt(e.target.value) || 1)}
                className="h-11 font-bold text-center bg-white border-slate-200"
              />
            </div>

            <div className="flex-none pb-0.5">
              <Button 
                onClick={handleAddClick} 
                disabled={!selectedItemId || maxAvailable <= 0}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 gap-2 font-bold"
              >
                <Plus className="w-5 h-5" /> Add to List
              </Button>
            </div>

            {selectedItem && (
              <div className="w-full mt-2 animate-in fade-in slide-in-from-top-1">
                <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100/50 flex items-center justify-between">
                  <div className="text-xs text-blue-700">
                    <span className="font-semibold">{selectedItem.name}</span>
                    {selectedItem.description && <span className="mx-2 text-blue-400">|</span>}
                    <span className="text-blue-500/80">{selectedItem.description}</span>
                  </div>
                  <div className="text-xs font-bold text-blue-700">
                    Line Total: Rs. {(selectedQty * Number(selectedItem.unit_price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
