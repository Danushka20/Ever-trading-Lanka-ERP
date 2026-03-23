import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreHorizontal, Printer, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/ui/page-header"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBInvoice } from "@/lib/types"

export default function InvoiceList() {
  const { data: invoices, isLoading } = useOfflineData<DBInvoice>("invoices")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredInvoices = invoices.filter((inv) =>
    inv.invoice_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof inv.dealer_id === 'object' && (inv.dealer_id as any)?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Confirmed</Badge>
      case 'hold':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Hold</Badge>
      case 'draft':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Draft</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <PageHeader 
        title="Invoice History" 
        description="Manage and track your generated invoices" 
        searchValue={searchQuery} 
        onSearchChange={setSearchQuery} 
        searchPlaceholder="Search invoice, customer or dealer..."
      >
        <Link to="/sales/create-invoice">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm">
            <FileText className="h-4 w-4" />Create New Invoice
          </Button>
        </Link>
      </PageHeader>

      <Card className="border-none shadow-sm overflow-hidden min-h-100">
        <CardHeader className="pb-3 border-b bg-white">
            <CardTitle className="text-lg font-bold">Generated Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState message="Loading invoices..." minHeight={200} />
          ) : filteredInvoices.length === 0 ? (
            <EmptyState variant={searchQuery ? "search" : "default"} title="No invoices found" />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6 w-32">Invoice #</TableHead>
                  <TableHead>Customer/Dealer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right px-4">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.sort((a, b) => new Date(b.created_at || b.invoice_date || new Date()).getTime() - new Date(a.created_at || a.invoice_date || new Date()).getTime()).map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                    <TableCell className="pl-6 py-4 font-bold text-blue-600">
                        {inv.invoice_no}
                        {!inv.synced && (
                             <span className="block text-[10px] text-amber-500 uppercase font-bold">Pending Sync</span>
                        )}
                    </TableCell>
                    <TableCell>
                        <div className="font-medium text-slate-900">
                            {inv.customer_name || (inv as any).dealer?.name || 'Walk-in Customer'}
                        </div>
                        <div className="text-xs text-slate-400">
                             {(inv as any).sales_area?.name || 'No Area'}
                        </div>
                    </TableCell>
                    <TableCell className="text-slate-500 whitespace-nowrap">
                        {new Date(inv.invoice_date || inv.created_at || new Date()).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800 text-right px-4">
                        Rs.{Number(inv.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inv.status)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                        <Link to={`/sales/print-invoice/${inv.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/sales/print-invoice/${inv.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 font-bold tracking-widest"><MoreHorizontal className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


