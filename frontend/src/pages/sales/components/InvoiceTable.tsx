import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DBInvoice } from "@/lib/types"
import { InvoiceRow } from "./InvoiceRow"
import { Pagination } from "./Pagination"

interface InvoiceTableProps {
  invoices: DBInvoice[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNextPage: boolean
  hasPrevPage: boolean
  onSettle?: (invoice: DBInvoice) => void
}

export function InvoiceTable({
  invoices,
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  onSettle,
}: InvoiceTableProps) {
  const sortedInvoices = invoices.sort(
    (a, b) =>
      new Date(b.created_at || b.invoice_date || new Date()).getTime() -
      new Date(a.created_at || a.invoice_date || new Date()).getTime()
  )

  return (
    <>
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="pl-6 w-32">Invoice #</TableHead>
            <TableHead>Customer/Dealer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items (Qty)</TableHead>
            <TableHead className="text-right px-4">Paid Amount</TableHead>
            <TableHead className="text-right px-4">Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvoices.map((invoice) => (
            <InvoiceRow key={invoice.id} invoice={invoice} onSettle={onSettle} />
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </>
  )
}
