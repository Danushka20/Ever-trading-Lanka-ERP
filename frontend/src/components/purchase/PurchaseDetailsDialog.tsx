import type { ReactNode } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Banknote, Calendar, Truck } from "lucide-react"
import type { DBPurchaseOrder } from "@/lib/types"
import { PrintPOButton } from "@/components/PrintPOButton"

type PurchaseDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPurchase: DBPurchaseOrder | null
  getStatusBadge: (status: string) => ReactNode
}

export function PurchaseDetailsDialog({
  open,
  onOpenChange,
  selectedPurchase,
  getStatusBadge,
}: PurchaseDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden border-none shadow-2xl sm:max-w-2xl">
        <div className="flex items-center justify-between p-6 text-center text-white bg-blue-600">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">Purchase Order Detail</h2>
            <div className="flex items-center justify-center gap-2 mt-2 opacity-90">
              <div className="px-3 py-1 text-xs font-black border rounded-full bg-blue-700/50 backdrop-blur-sm border-white/20">
                PO-{selectedPurchase?.id && String(selectedPurchase.id).padStart(4, "0")}
              </div>
              {selectedPurchase && getStatusBadge(selectedPurchase.status)}
            </div>
          </div>
          {selectedPurchase && (
            <PrintPOButton purchase={selectedPurchase} supplier={(selectedPurchase as any).supplier} />
          )}
        </div>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8 p-4 border rounded-2xl bg-slate-50 border-slate-100">
            <div>
              <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-1 flex items-center gap-1">
                <Truck className="w-3 h-3" /> Supplier Information
              </h3>
              <p className="text-lg font-black leading-tight text-slate-900">{(selectedPurchase as any)?.supplier?.name}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{(selectedPurchase as any)?.supplier?.phone || "No contact info"}</p>
            </div>
            <div className="text-right">
              <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-1 flex items-center justify-end gap-1">
                <Calendar className="w-3 h-3" /> Issuance Date
              </h3>
              <p className="text-lg font-black leading-tight text-slate-900">
                {selectedPurchase?.order_date &&
                  new Date(selectedPurchase.order_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Generated on {selectedPurchase?.created_at && new Date(selectedPurchase.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="overflow-hidden border shadow-sm border-slate-100 rounded-2xl">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4">Item Catalog</TableHead>
                  <TableHead className="text-right font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4">Quantity</TableHead>
                  <TableHead className="text-right font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4">Rate (Rs.)</TableHead>
                  <TableHead className="text-right font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4 pr-6">Line Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPurchase?.items?.map((item: any, idx: number) => (
                  <TableRow key={idx} className="border-slate-50">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="mb-1 text-sm font-bold leading-none text-slate-900">{item.item?.name || item.name || "Product"}</span>
                        <span className="text-[10px] font-mono text-slate-400">BATCH: {item.batch_number || "AUTO-GEN"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 text-xs font-black rounded-md bg-slate-100 text-slate-600">
                        {Number(item.quantity).toLocaleString()} PCS
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-right text-slate-600">
                      {Number(item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <span className="text-sm font-black text-slate-900 tabular-nums">
                        Rs.{Number(item.total_price || item.quantity * item.unit_price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-6 border border-blue-100 bg-blue-50/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 text-white bg-blue-600 shadow-lg rounded-xl shadow-blue-200">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-blue-600 opacity-70">Payment Status</p>
                <p className="text-sm font-black text-slate-900">Total Purchase Value</p>
              </div>
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs font-bold tracking-tighter text-blue-600 uppercase">Final Payable Amount</p>
              <p className="text-4xl font-black tracking-tighter text-blue-700 tabular-nums">
                Rs.
                {(selectedPurchase?.total || selectedPurchase?.total_amount) &&
                  Number(selectedPurchase.total || selectedPurchase.total_amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
