import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ProfitLossReportProps {
  invoices: any[];
  itemsList: any[];
  stockBatches: any[];
}

export const InvoiceProfitLossButton: React.FC<ProfitLossReportProps> = ({ 
  invoices, 
  itemsList, 
  stockBatches 
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Fetch company info for header
      let companyInfo = null;
      try {
        const response = await api.get('/settings/company-info');
        companyInfo = response.data;
      } catch (e) {
        console.error("Failed to fetch company info", e);
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const dateStr = format(new Date(), 'yyyy-MM-dd HH:mm');

      // Header
      doc.setFontSize(20);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(companyInfo?.company_name || "Invoice Profit & Loss Report", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-400
      doc.text(`Generated: ${dateStr}`, 14, 30);
      
      if (companyInfo?.address) {
        doc.text(companyInfo.address, 14, 35);
      }

      // Summary Box (Modern Header)
      const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0);
      let totalCost = 0;
      invoices.forEach(inv => {
        if (inv.items) {
          inv.items.forEach((item: any) => {
            const productId = item.product_id || item.item_id;
            const batch = stockBatches.find(b => 
              (b.product_id === productId || b.item_id === productId) && 
              b.batch_no === item.batch_no
            );
            const itemData = itemsList.find(i => i.id === productId);
            const fallbackCost = Number(itemData?.buy_price || itemData?.unit_price || 0);
            totalCost += (Number(item.qty || 0) * (Number(batch?.cost_price) || fallbackCost));
          });
        }
      });
      const totalProfit = totalRevenue - totalCost;
      const totalMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

      // Draw modern summary boxes
      doc.setFillColor(248, 250, 252); // slate-50
      doc.roundedRect(14, 42, pageWidth - 28, 25, 3, 3, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // slate-400
      doc.text("TOTAL REVENUE", 20, 50);
      doc.text("TOTAL COST", 70, 50);
      doc.text("GROSS PROFIT", 120, 50);
      doc.text("NET MARGIN", 170, 50);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(`Rs. ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 20, 58);
      doc.text(`Rs. ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 70, 58);
      
      if (totalProfit >= 0) {
        doc.setTextColor(16, 185, 129); // emerald
      } else {
        doc.setTextColor(225, 29, 72); // rose
      }
      doc.text(`Rs. ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 120, 58);
      doc.text(`${totalMargin.toFixed(1)}%`, 170, 58);

      // --- Add Detailed Table per Product ---
      const detailedTableData: any[] = [];
      invoices.forEach(inv => {
        if (inv.items && Array.isArray(inv.items)) {
          inv.items.forEach((item: any) => {
            const qty = Number(item.qty || 0);
            const productId = item.product_id || item.item_id;
            
            // Look into the item object itself for the batch information if it's there
            // Some systems store the batch_no directly on the invoice item record
            const itemBatchNo = item.batch_no || item.stock_batch_no || '-';
            
            const itemData = itemsList.find(i => i.id === productId);
            const batch = stockBatches.find(b => 
              (b.product_id === productId || b.item_id === productId) && 
              (b.batch_no === itemBatchNo || b.id === item.stock_batch_id)
            );
            
            const sellPrice = Number(item.unit_price || 0);
            const costPrice = Number(batch?.cost_price) || Number(itemData?.buy_price || itemData?.unit_price || 0);
            const revenue = qty * sellPrice;
            const cost = qty * costPrice;
            const profit = revenue - cost;
            const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

            detailedTableData.push([
              inv.invoice_no,
              itemData?.name || 'Unknown Item',
              batch?.batch_no || itemBatchNo,
              qty,
              costPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }),
              sellPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }),
              profit.toLocaleString(undefined, { minimumFractionDigits: 2 }),
              `${margin.toFixed(1)}%`
            ]);
          });
        }
      });

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("Detailed Item Profitability", 14, 80);

      autoTable(doc, {
        startY: 85,
        head: [['Invoice', 'Item Name', 'Batch', 'Qty', 'Cost', 'Sell', 'Profit', 'Margin']],
        body: detailedTableData,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [71, 85, 105], halign: 'center' },
        columnStyles: {
          3: { halign: 'center' },
          4: { halign: 'right' },
          5: { halign: 'right' },
          6: { halign: 'right', fontStyle: 'bold' },
          7: { halign: 'center' },
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 6) {
            const val = parseFloat(data.cell.text[0].replace(/,/g, ''));
            if (val < 0) doc.setTextColor(225, 29, 72);
            else doc.setTextColor(16, 185, 129);
          }
        }
      });

      // --- Add Invoice Summary Table ---
      doc.addPage();
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Invoice Summary Report", 14, 20);

      const tableData = invoices.map(invoice => {
        let invoiceTotalCost = 0;
        let invoiceRevenue = Number(invoice.total || 0);

        // Calculate cost for each item in invoice
        if (invoice.items && Array.isArray(invoice.items)) {
          invoice.items.forEach((item: any) => {
            const qty = Number(item.qty || 0);
            const productId = item.product_id || item.item_id;
            
            const itemBatchNo = item.batch_no || item.stock_batch_no;

            // Find cost from stock batches
            const batch = stockBatches.find(b => 
              (b.product_id === productId || b.item_id === productId) && 
              (b.batch_no === itemBatchNo || b.id === item.stock_batch_id)
            );

            const itemData = itemsList.find(i => i.id === productId);
            const fallbackCost = Number(itemData?.buy_price || itemData?.unit_price || 0);

            const costPrice = Number(batch?.cost_price) || fallbackCost;
            invoiceTotalCost += (qty * costPrice);
          });
        }

        const profit = invoiceRevenue - invoiceTotalCost;
        const profitMargin = invoiceRevenue > 0 ? (profit / invoiceRevenue) * 100 : 0;

        return [
          invoice.invoice_no,
          invoice.customer_name || (invoice as any).dealer?.name || 'Walk-in',
          format(new Date(invoice.invoice_date || invoice.created_at), 'yyyy-MM-dd'),
          invoiceRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          invoiceTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          profit.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          `${profitMargin.toFixed(1)}%`
        ];
      });

      autoTable(doc, {
        startY: 25,
        head: [['Invoice #', 'Customer', 'Date', 'Revenue', 'Cost', 'Profit', 'Margin']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { 
          fillColor: [30, 41, 59], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { fontStyle: 'bold', halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'right' },
          5: { halign: 'right' },
          6: { halign: 'center', fontStyle: 'bold' },
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
            const val = parseFloat(data.cell.text[0].replace(/,/g, ''));
            if (val < 0) doc.setTextColor(225, 29, 72);
            else doc.setTextColor(16, 185, 129);
          }
        },
        margin: { top: 20 }
      });

      doc.save(`Profit-Loss-Report-${format(new Date(), 'yyyyMMdd-HHmm')}.pdf`);
      toast.success("Profit & Loss report generated");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generateReport} 
      disabled={isGenerating}
      variant="outline"
      className="gap-2 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Printer className="w-4 h-4" />
      )}
      Report Profit & Loss
    </Button>
  );
};
