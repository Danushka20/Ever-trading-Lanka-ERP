import { useParams, useNavigate } from "react-router-dom"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBInvoice, DBItem } from "@/lib/types"
import { LoadingState } from "@/components/ui/loading-state"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Printer, ArrowLeft, Download } from "lucide-react"
import { useRef } from "react"

export default function PrintInvoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: invoices, isLoading } = useOfflineData<DBInvoice>("invoices")
  const { data: items_list } = useOfflineData<DBItem>("items")
  const printRef = useRef<HTMLDivElement>(null)

  const invoice = invoices.find(inv => inv.id.toString() === id)

  const getItemName = (itemId: number) => {
    return items_list.find(i => i.id === itemId)?.name || "Item Not Found"
  }

  const handlePrint = () => {
    const originalTitle = document.title
    document.title = `Invoice_${invoice?.invoice_no}`
    window.print()
    document.title = originalTitle
  }

  if (isLoading) return <LoadingState message="Loading invoice details..." />
  if (!invoice) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600">Invoice not found</h2>
      <Button onClick={() => navigate(-1)} className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" /> Go Back</Button>
    </div>
  )

  return (
    <div className="flex-1 p-4 overflow-auto bg-slate-50 sm:p-8">
      {/* Action Bar - Hidden during print */}
      <div className="flex flex-wrap items-center justify-between max-w-4xl gap-4 mx-auto mb-6 print:hidden">
        <Button variant="outline" onClick={() => navigate(-1)} className="bg-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white" onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <div 
        ref={printRef}
        className="max-w-4xl mx-auto overflow-hidden bg-white border rounded-lg shadow-xl print:shadow-none print:border-none print:m-0"
      >
        {/* Header Decorator */}
        <div className="w-full h-2 bg-blue-600" />
        
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex flex-col justify-between gap-8 mb-12 md:flex-row">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tight uppercase text-slate-800">Narendra Aiya</h1>
              </div>
              <div className="space-y-1 text-slate-500">
                <p className="font-medium">Inventory & Sales Management</p>
                <p>123 Business Street, Colombo 03</p>
                <p>Sri Lanka</p>
                <p>Phone: +94 11 234 5678</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="mb-2 text-4xl font-bold text-slate-800">INVOICE</h2>
              <p className="font-medium text-slate-500">#{invoice.invoice_no}</p>
              <div className="flex flex-col items-end gap-1 mt-4">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                   invoice.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                   invoice.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                   'bg-amber-100 text-amber-700'
                 }`}>
                   {invoice.status}
                 </span>
                 {!invoice.synced && (
                   <span className="text-[10px] text-amber-500 font-bold uppercase">Pending Server Sync</span>
                 )}
              </div>
            </div>
          </div>

          <hr className="mb-12 border-slate-100" />

          {/* Billing Info */}
          <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-slate-400">Bill To</h3>
              <div className="text-slate-800">
                <p className="text-xl font-bold">{invoice.customer_name}</p>
                <p className="mt-2 text-slate-500">
                  {(invoice as any).sales_area?.name || "Region: Not Specified"}
                </p>
                {invoice.notes && (
                  <div className="p-3 mt-4 text-sm italic rounded bg-slate-50 text-slate-600">
                    {invoice.notes}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 text-xs font-bold tracking-widest uppercase text-slate-400">Invoice Date</h3>
                <p className="font-medium text-slate-800">{new Date(invoice.invoice_date || new Date()).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-bold tracking-widest uppercase text-slate-400">Due Date</h3>
                <p className="font-medium text-slate-800">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : '-'}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-12">
            <Table>
              <TableHeader className="bg-slate-50 border-y">
                <TableRow>
                  <TableHead className="w-12 text-slate-800">#</TableHead>
                  <TableHead className="text-slate-800">Description</TableHead>
                  <TableHead className="text-center text-slate-800">Qty</TableHead>
                  <TableHead className="text-right text-slate-800">Price</TableHead>
                  <TableHead className="text-right text-slate-800">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice?.items?.map((item: any, index: number) => (
                  <TableRow key={index} className="border-b border-slate-50">
                    <TableCell className="text-slate-500">{index + 1}</TableCell>
                    <TableCell>
                      <p className="font-bold text-slate-800">{getItemName(item.item_id)}</p>
                      <p className="text-xs font-medium text-slate-400">Batch: {item.batch_no || 'Default'}</p>
                    </TableCell>
                    <TableCell className="font-medium text-center text-slate-700">{item.qty}</TableCell>
                    <TableCell className="font-medium text-right text-slate-700">Rs.{Number(item.unit_price).toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-right text-slate-800">Rs.{Number(item.total).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full space-y-3 sm:w-80">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700">Rs.{Number(invoice?.sub_total || invoice?.total).toLocaleString()}</span>
              </div>
              {Number(invoice?.discount || 0) > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span className="font-medium">-Rs.{Number(invoice.discount).toLocaleString()}</span>
                </div>
              )}
              <hr className="border-slate-100" />
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-slate-800">Amount Due</span>
                <span className="text-2xl font-black text-blue-600">Rs.{Number(invoice.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 mt-24 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500">Thank you for your business!</p>
            <p className="mt-2 text-xs italic text-slate-400">This is a computer generated invoice and does not require a physical signature.</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:m-0 {
            margin: 0 !important;
          }
          @page {
            margin: 1.5cm;
          }
        }
      `}</style>
    </div>
  )
}

function Receipt({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
            <path d="M16 8h-6" />
            <path d="M16 12H8" />
            <path d="M13 16H8" />
        </svg>
    )
}
