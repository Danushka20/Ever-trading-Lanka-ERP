import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Eye, MoreHorizontal, Printer, PencilIcon, Banknote } from "lucide-react"
import { Link } from "react-router-dom"
import type { DBInvoice, DBItem } from "@/lib/types"
import { StatusBadge } from "./StatusBadge"
import { useOfflineData } from "@/hooks/useOfflineData"

interface InvoiceRowProps {
  invoice: DBInvoice
  onSettle?: (invoice: DBInvoice) => void
}

export function InvoiceRow({ invoice, onSettle }: InvoiceRowProps) {
  const isHold = invoice.status === "hold"
  const isDealer = !!invoice.dealer_id
  const isNotCompleted = invoice.status !== "completed" && invoice.status !== "hold" && isDealer
  const { data: items_list } = useOfflineData<DBItem>("items")

  return (
    <TableRow className="hover:bg-slate-50/80 transition-colors group">
      <TableCell className="pl-6 py-4 font-bold text-blue-600">
        {invoice.invoice_no}
        {!invoice.synced && (
          <span className="block text-[10px] text-amber-500 uppercase font-bold">Pending Sync</span>
        )}
      </TableCell>
      <TableCell>
        <div className="font-medium text-slate-900">
          {invoice.customer_name || (invoice as any).dealer?.name || 'Walk-in Customer'}
        </div>
        <div className="text-xs text-slate-400">
          {(invoice as any).sales_area?.name || 'No Area'}
        </div>
      </TableCell>
      <TableCell className="text-slate-500 whitespace-nowrap">
        {new Date(invoice.invoice_date || invoice.created_at || new Date()).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="max-w-[300px] flex flex-wrap gap-1">
          {invoice.items && invoice.items.length > 0 ? (
            invoice.items.slice(0, 3).map((item: any, idx) => {
              // Handle both item object and item_id-only cases
              const itemId = (item.item_id || item.product_id)?.toString();
              const itemName = item.item?.name || 
                               (items_list && items_list.find((i: any) => i.id.toString() === itemId)?.name) || 
                               'Item';
              return (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  {itemName}: {Number(item.qty)}
                </span>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 italic">No items found</span>
          )}
          {invoice.items && invoice.items.length > 3 && (
            <span className="text-[10px] text-slate-400 font-medium">+{invoice.items.length - 3} more</span>
          )}
        </div>
      </TableCell>
      <TableCell className="font-bold text-green-600 text-right px-4">
        Rs.{Number(invoice.settle_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </TableCell>
      <TableCell className="font-bold text-slate-800 text-right px-4">
        Rs.{Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </TableCell>
      <TableCell>
        <StatusBadge status={invoice.status} />
      </TableCell>
      <TableCell className="text-right pr-6">
        <div className="flex items-center justify-end gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
          {isHold && (
            <Link to={`/sales/edit-invoice/${invoice.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {isNotCompleted && onSettle && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
              onClick={() => onSettle(invoice)}
              title="Add Payment"
            >
              <Banknote className="h-4 w-4" />
            </Button>
          )}
          <Link to={`/sales/print-invoice/${invoice.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/sales/print-invoice/${invoice.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
              <Printer className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 font-bold tracking-widest">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
