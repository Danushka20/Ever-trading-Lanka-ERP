import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface PrintPOButtonProps {
  purchase: any
  supplier: any
}

export function PrintPOButton({ purchase, supplier }: PrintPOButtonProps) {
  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFillColor(37, 99, 235) // Blue-600
    doc.rect(0, 0, pageWidth, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("PURCHASE ORDER", pageWidth / 2, 15, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`PO-${String(purchase.id).padStart(4, "0")}`, pageWidth / 2, 25, { align: "center" })
    doc.text(new Date().toLocaleDateString("en-IN"), pageWidth / 2, 32, { align: "center" })

    // Info Section
    let yPosition = 50

    // Supplier Info
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("SUPPLIER INFORMATION", 15, yPosition)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    yPosition += 7
    doc.text(`Name: ${supplier?.name || "N/A"}`, 15, yPosition)
    yPosition += 6
    doc.text(`Phone: ${supplier?.phone || "N/A"}`, 15, yPosition)
    yPosition += 6
    doc.text(`Email: ${supplier?.email || "N/A"}`, 15, yPosition)

    // Order Details
    yPosition += 10
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("ORDER DETAILS", 15, yPosition)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    yPosition += 7
    doc.text(`Order Date: ${new Date(purchase.order_date || purchase.created_at).toLocaleDateString("en-IN", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    })}`, 15, yPosition)
    yPosition += 6
    doc.text(`Status: ${purchase.status?.toUpperCase() || "PENDING"}`, 15, yPosition)

    // Items Table
    yPosition += 12
    const tableData = purchase.items?.map((item: any) => [
      item.item?.name || item.name || "Product",
      String(Number(item.quantity).toLocaleString()),
      `Rs.${Number(item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      `Rs.${Number(item.total_price || (item.quantity * item.unit_price)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    ]) || []

    ;(doc as any).autoTable({
      head: [["Item", "Quantity", "Unit Price", "Total"]],
      body: tableData,
      startY: yPosition,
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
        halign: "center"
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [0, 0, 0]
      },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right", fontStyle: "bold" }
      },
      didDrawPage: () => {
        // Footer
        const pageSize = doc.internal.pageSize
        const pageHeight = pageSize.getHeight()
        const pageWidthFooter = pageSize.getWidth()
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(
          `Generated on ${new Date().toLocaleString("en-IN")}`,
          pageWidthFooter / 2,
          pageHeight - 10,
          { align: "center" }
        )
      }
    })

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(37, 99, 235)
    doc.text(
      `Total Amount: Rs.${Number(purchase.total || purchase.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      pageWidth - 15,
      finalY,
      { align: "right" }
    )

    // Save PDF
    const fileName = `PO-${String(purchase.id).padStart(4, "0")}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  return (
    <Button
      onClick={generatePDF}
      className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
    >
      <Download className="w-4 h-4" />
      Print PDF
    </Button>
  )
}
