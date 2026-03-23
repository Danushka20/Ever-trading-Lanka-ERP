import type { ReactNode } from "react"
import { Eye, Truck, ChevronRight, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/loading-state"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DBPurchaseOrder } from "@/lib/types"

type PurchaseActivityTableProps = {
  isLoading: boolean
  filteredCount: number
  purchases: DBPurchaseOrder[]
  onViewDetails: (purchase: DBPurchaseOrder) => void
  getStatusBadge: (status: string) => ReactNode
}

export function PurchaseActivityTable({
  isLoading,
  filteredCount,
  purchases,
  onViewDetails,
  getStatusBadge,
}: PurchaseActivityTableProps) {
  return (
    <Card className="overflow-hidden bg-white border-none shadow-xl shadow-slate-200/50 rounded-3xl">
      <CardHeader className="px-8 py-6 border-b border-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            Recent Activity
            <Badge variant="secondary" className="font-bold text-blue-700 border-none bg-blue-50">
              Live
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <LoadingState message="Fetching your orders..." minHeight={300} />
        ) : filteredCount === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-slate-50">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Orders Found</h3>
            <p className="max-w-xs mx-auto text-slate-500">Try adjusting your search or create a new purchase order to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="pl-8 font-bold text-slate-500 py-4 uppercase text-[11px] tracking-widest">Order ID</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 uppercase text-[11px] tracking-widest">Supplier</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 uppercase text-[11px] tracking-widest">Date</TableHead>
                  <TableHead className="text-right font-bold text-slate-500 py-4 uppercase text-[11px] tracking-widest">Items</TableHead>
                  <TableHead className="text-right font-bold text-slate-500 py-4 uppercase text-[11px] tracking-widest">Total Amount</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 uppercase text-[11px] tracking-widest">Status</TableHead>
                  <TableHead className="pr-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases
                  .sort((a, b) => new Date(b.created_at || new Date()).getTime() - new Date(a.created_at || new Date()).getTime())
                  .map((purchase) => (
                    <TableRow
                      key={purchase.id}
                      className="transition-colors cursor-pointer group border-slate-50 hover:bg-slate-50/50"
                      onClick={() => onViewDetails(purchase)}
                    >
                      <TableCell className="py-5 pl-8">
                        <div className="flex flex-col">
                          <span className="font-mono text-base font-black tracking-tighter text-slate-900">#PO-{String(purchase.id).padStart(4, "0")}</span>
                          {!purchase.synced && (
                            <span className="text-[9px] text-amber-600 font-black uppercase flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" /> Pending Sync
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 transition-all rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white">
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-700">{(purchase as any).supplier?.name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-500">
                          {new Date(purchase.order_date || purchase.created_at || new Date()).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="px-2 py-1 text-xs font-black rounded-md bg-slate-100 text-slate-600 tabular-nums">
                          {purchase.items?.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0) || 0} PCS
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-base font-black text-slate-900 tabular-nums">
                          Rs.{Number(purchase.total || purchase.total_amount || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 transition-all rounded-lg hover:bg-blue-50 hover:text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              onViewDetails(purchase)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <ChevronRight className="w-5 h-5 transition-all text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
