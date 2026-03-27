import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import jsPDF from "jspdf"
import "jspdf-autotable"
import type { DealerWithStats } from "@/hooks/dealers/types"
import type { DBInvoice } from "@/lib/types"
import { useOfflineData } from "@/hooks/useOfflineData"

interface DealerPerformancePdfButtonProps {
  dealers: DealerWithStats[]
  areaName?: string
}

export function DealerPerformancePdfButton({ dealers, areaName }: DealerPerformancePdfButtonProps) {
  const { data: invoices = [] } = useOfflineData<DBInvoice>("invoices")

  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const dateStr = new Date().toLocaleDateString("en-IN")

    // Helper to ensure autoTable is available
    const autoTable = (doc as any).autoTable;
    if (!autoTable) {
      console.error("autoTable is not available on jsPDF instance");
      return;
    }

    // Header
    doc.setFillColor(37, 99, 235) // Blue-600
    doc.rect(0, 0, pageWidth, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("DEALER PERFORMANCE & OUTSTANDING REPORT", pageWidth / 2, 15, { align: "center" })

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Region: ${areaName || "All Areas"}`, pageWidth / 2, 25, { align: "center" })
    doc.text(`Generated on: ${dateStr}`, pageWidth / 2, 32, { align: "center" })

    let yPosition = 50

    dealers.forEach((dealer, index) => {
      // Check if we need a new page for the next dealer
      if (yPosition > 240) {
        doc.addPage()
        yPosition = 20
      }

      // Dealer Section Header
      doc.setFillColor(248, 250, 252) // Slate-50
      doc.rect(15, yPosition, pageWidth - 30, 25, "F")
      
      doc.setTextColor(15, 23, 42) // Slate-900
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(dealer.name.toUpperCase(), 20, yPosition + 10)
      
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(100, 116, 139) // Slate-500
      doc.text(`Address: ${dealer.address || dealer.main_town || "N/A"}`, 20, yPosition + 17)
      doc.text(`Contact: ${dealer.phone || "N/A"}`, 20, yPosition + 22)

      // Summary Stats for Dealer
      doc.setFontSize(9)
      doc.setTextColor(15, 23, 42)
      doc.setFont("helvetica", "bold")
      const statsX = pageWidth - 80
      doc.text(`Total Sales: Rs. ${Number(dealer.totalSales).toLocaleString()}`, statsX, yPosition + 10)
      doc.setTextColor(239, 68, 68) // Red-500 for Balance
      doc.text(`Outstanding: Rs. ${Number(dealer.balance).toLocaleString()}`, statsX, yPosition + 17)

      yPosition += 30

      // Invoices Table for this Dealer
      const dealerInvoices = invoices
        .filter(inv => inv.dealer_id === dealer.id)
        .sort((a, b) => new Date(a.invoice_date || a.created_at || "").getTime() - new Date(b.invoice_date || b.created_at || "").getTime())

      const tableData = dealerInvoices.map(inv => [
        inv.invoice_no,
        new Date(inv.invoice_date || inv.created_at || "").toLocaleDateString("en-IN"),
        `Rs. ${Number(inv.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        `Rs. ${Number(inv.settle_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        `Rs. ${(Number(inv.total) - Number(inv.settle_amount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      ])

      if (tableData.length > 0) {
        autoTable(doc, {
          head: [["Invoice #", "Date", "Total Amount", "Paid Amount", "Balance"]],
          body: tableData,
          startY: yPosition,
          margin: { left: 20, right: 20 },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: "bold" },
          columnStyles: {
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right", fontStyle: "bold" }
          },
        })
        yPosition = (doc as any).lastAutoTable.cursor.y + 15
      } else {
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(148, 163, 184)
        doc.text("No invoice records found for this dealer.", 20, yPosition + 5)
        yPosition += 15
      }

      // Separator Line
      if (index < dealers.length - 1) {
        doc.setDrawColor(226, 232, 240)
        doc.line(15, yPosition - 5, pageWidth - 15, yPosition - 5)
        yPosition += 5
      }
    })

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text(
        `Page ${i} of ${pageCount} - Narendra-Aiya Software ERP`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      )
    }

    doc.save(`Dealer_Performance_${areaName || "All"}_${new Date().getTime()}.pdf`)
  }

  return (
    <Button 
      onClick={generatePDF} 
      variant="outline" 
      size="sm"
      className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
      disabled={dealers.length === 0}
    >
      <FileDown className="w-4 h-4" />
      Download PDF Report
    </Button>
  )
}
