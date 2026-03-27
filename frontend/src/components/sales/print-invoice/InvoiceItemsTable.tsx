import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DBItem } from "@/lib/types"

interface InvoiceItemsTableProps {
  invoice: any
  items_list: DBItem[]
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ invoice, items_list }) => {
  const getItemName = (item: any) => {
    // If the item itself has a name (manually added or already loaded)
    if (item.item?.name) return item.item.name;
    if (item.item_name) return item.item_name;
    
    // Fallback to searching in the items_list
    const itemId = item.item_id || item.product_id;
    return items_list.find(i => i.id === itemId)?.name || "Item Not Found";
  }

  const getItemDescription = (item: any) => {
    // Check if there is an explicit description on the item row
    if (item.description) return item.description;
    
    // Check if the related item object has a description
    if (item.item?.description) return item.item.description;
    
    // Fallback to searching in items_list
    const itemId = item.item_id || item.product_id;
    const foundItem = items_list.find(i => i.id === itemId);
    return foundItem?.description || null;
  }

  return (
    <div className="mb-12 rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow className="hover:bg-slate-900 border-none">
            <TableHead className="w-12 text-white font-bold text-[10px] uppercase tracking-widest py-4">#</TableHead>
            <TableHead className="text-white font-bold text-[10px] uppercase tracking-widest py-4">Description</TableHead>
            <TableHead className="text-center text-white font-bold text-[10px] uppercase tracking-widest py-4">Qty</TableHead>
            <TableHead className="text-right text-white font-bold text-[10px] uppercase tracking-widest py-4">Unit Price</TableHead>
            <TableHead className="text-right text-white font-bold text-[10px] uppercase tracking-widest py-4">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoice?.items?.map((item: any, index: number) => (
            <TableRow key={index} className="border-b border-slate-50 hover:bg-slate-50 font-medium">
              <TableCell className="text-slate-400 font-bold">{String(index + 1).padStart(2, '0')}</TableCell>
              <TableCell>
                <p className="font-black text-slate-800">{getItemName(item)}</p>
                {getItemDescription(item) && (
                  <p className="text-xs text-slate-500 mt-0.5">{getItemDescription(item)}</p>
                )}
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Batch: {item.batch_no || 'Default'}</p>
              </TableCell>
              <TableCell className="text-center">
                 <span className="bg-slate-100 px-3 py-1 rounded-md text-slate-700 font-black">
                   {Number(item.qty).toString()}
                 </span>
              </TableCell>
              <TableCell className="text-right text-slate-600 font-bold">Rs.{Number(item.unit_price).toLocaleString()}</TableCell>
              <TableCell className="text-right text-slate-900 font-black">Rs.{Number(item.total).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
