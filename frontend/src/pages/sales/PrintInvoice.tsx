import { useParams } from "react-router-dom"
import { LoadingState } from "@/components/ui/loading-state"
import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft, Download } from "lucide-react"
import { useRef } from "react"
import { ModernInvoice } from "@/components/sales/print-invoice/ModernInvoice"
import { usePrintInvoice } from "@/components/sales/print-invoice/usePrintInvoice"
export default function PrintInvoice() {
  const { id } = useParams()
  const printRef = useRef<HTMLDivElement>(null)
  const { 
    invoice, 
    dealer, 
    items_list, 
    sales_areas, 
    companyInfo, 
    isLoading, 
    handlePrint, 
    goBack 
  } = usePrintInvoice(id)
  if (isLoading) return <LoadingState message="Loading invoice details..." />
  if (!invoice) return (
    <div className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-red-600">Invoice not found</h2>
      <p className="mb-6 text-slate-500">The invoice ID {id} could not be located in our system.</p>
      <Button onClick={goBack}><ArrowLeft className="w-4 h-4 mr-2" /> Go Back</Button>
    </div>
  )
  return (
    <div className="flex-1 min-h-screen p-4 overflow-auto print-shell bg-slate-50 sm:p-8 print:p-0 print:bg-white print:overflow-visible">
      {/* Action Bar - Hidden during print */}
      <div className="flex flex-wrap items-center justify-between max-w-4xl gap-4 mx-auto mb-6 print:hidden">
        <Button variant="outline" onClick={goBack} className="bg-white">
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
        id="printable-invoice"
        className="max-w-4xl mx-auto overflow-hidden bg-white border shadow-2xl rounded-3xl print:shadow-none print:overflow-visible"
      >
        <ModernInvoice 
          invoice={invoice}
          dealer={dealer || null}
          items_list={items_list}
          sales_areas={sales_areas}
          companyInfo={companyInfo}
        />
      </div>
      {/* Print styles */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html, body {
            height: auto !important;
            width: auto !important;
            overflow: visible !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          body * {
            visibility: hidden !important;
          }

          #printable-invoice,
          #printable-invoice * {
            visibility: visible !important;
          }

          #printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 190mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            border-radius: 18px !important;
            transform: none !important;
            transform-origin: top center;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }

          #printable-invoice table,
          #printable-invoice thead,
          #printable-invoice tbody,
          #printable-invoice tr,
          #printable-invoice td,
          #printable-invoice th {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .print-shell {
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            background: white !important;
          }

          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  )
}
