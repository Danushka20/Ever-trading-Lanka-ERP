import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PDFExportOptions {
  title: string;
  filename: string;
  columns: string[];
  data: any[][];
}

export const exportToPDF = ({ title, filename, columns, data }: PDFExportOptions) => {
  const doc = new jsPDF();
  
  // Header with styling
  doc.setFontSize(22);
  doc.setTextColor(30, 64, 175); // Blue-700
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
  
  // Draw a line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 32, 196, 32);

  (doc as any).autoTable({
    head: [columns],
    body: data,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 4,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [37, 99, 235], // Blue-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate-50
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      // Align currency columns to right if they exist
      4: { halign: 'right' }, 
    },
    margin: { top: 40 },
  });

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
