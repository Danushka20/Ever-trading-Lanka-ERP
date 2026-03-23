import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '@/lib/api';

interface ExportButtonProps {
  data: any[];
  filename: string;
  columns: { header: string; key: string }[];
  title?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, columns, title }) => {
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await api.get('/company-info');
        setCompanyInfo(response.data);
      } catch (error) {
        console.error('Error fetching company info for export:', error);
      }
    };
    fetchCompanyInfo();
  }, []);

  const getCellValue = (item: any, key: string) => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], item);
    
    if (typeof value === 'boolean') {
      return value ? 'Active' : 'Inactive';
    }
    
    if (value === 0) return '0';
    
    return value || 'N/A';
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item) => {
        const row: any = {};
        columns.forEach((col) => {
          row[col.header] = getCellValue(item, col.key);
        });
        return row;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportToPDF = async () => {
    // Automatically switch to landscape if there are many columns
    const isLandscape = columns.length > 5;
    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // ===== PREMIUM GRADIENT HEADER SECTION =====
    // Main gradient background (dark blue to teal)
    doc.setFillColor(6, 45, 120); // Dark blue
    doc.rect(0, 0, pageWidth, 18, 'F');
    
    doc.setFillColor(16, 70, 150); // Medium blue
    doc.rect(0, 18, pageWidth, 15, 'F');
    
    doc.setFillColor(32, 120, 190); // Bright teal-blue
    doc.rect(0, 33, pageWidth, 7, 'F');

    // Premium accent bars with vibrant colors
    doc.setFillColor(34, 197, 94); // Vibrant green
    doc.rect(0, 0, pageWidth, 0.8, 'F');
    
    doc.setFillColor(99, 102, 241); // Indigo accent (right)
    doc.rect(pageWidth - 4, 0, 4, 40, 'F');
    
    doc.setFillColor(236, 72, 153); // Pink accent (left)
    doc.rect(0, 39.2, pageWidth, 0.8, 'F');

    // Add Company Logo if available
    if (companyInfo?.logo) {
      try {
        const logoUrl = 'http://localhost:8000/api/company-logo';
        const logoResponse = await fetch(logoUrl, { method: 'GET' });

        if (logoResponse.ok) {
          const blob = await logoResponse.blob();
          const base64Data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          // Premium logo design with gradient circle
          doc.setFillColor(255, 255, 255);
          doc.circle(21, 20, 17, 'F');
          
          // Logo border ring
          doc.setDrawColor(99, 102, 241);
          doc.setLineWidth(0.4);
          doc.circle(21, 20, 17);
          
          doc.addImage(base64Data, 'PNG', 8, 6, 26, 26, undefined, 'FAST');
        }
      } catch (e) {
        console.error('Could not fetch logo for PDF:', e);
      }
    }

    if (title) {
      // Premium Title with advanced font styling
      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), 40, 14);
      
      // Decorative accent line under title
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(0.6);
      doc.line(40, 16.5, 120, 16.5);
      
      // Company Info
      const companyName = companyInfo?.name || 'Narendra-aiya Software';
      const companyAddress = `${companyInfo?.address || ''}, ${companyInfo?.city || ''}`;
      const companyContact = `${companyInfo?.phone || ''} | ${companyInfo?.email || ''}`;
      
      // Company name with premium styling
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(companyName, 40, 25);
      
      // Contact info with lighter color
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      
      if (companyAddress.trim() !== ',') {
        doc.text(companyAddress, 40, 31);
      }
      if (companyContact.trim() !== ' | ') {
        doc.text(companyContact, 40, 36);
      }
    }

    // Store company name for footer use
    const companyName = companyInfo?.name || 'Narendra-aiya Software';

    // ===== PREMIUM DATA TABLE WITH COLORS =====
    const tableRows = data.map((item) =>
      columns.map((col) => getCellValue(item, col.key))
    );

    autoTable(doc, {
      startY: 43,
      head: [columns.map((col) => col.header.toUpperCase())],
      body: tableRows,
      theme: 'striped',
      headStyles: { 
        fillColor: [16, 70, 150],
        textColor: [255, 255, 255],
        fontSize: 7.8, 
        fontStyle: 'bold',
        font: 'helvetica',
        halign: 'left',
        valign: 'middle',
        cellPadding: 3,
        overflow: 'linebreak',
        lineColor: [34, 197, 94],
        lineWidth: 0.6,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2.5,
        overflow: 'linebreak',
        textColor: [25, 25, 35],
        lineColor: [219, 234, 254],
        lineWidth: 0.15,
        font: 'helvetica',
        halign: 'left',
        valign: 'top',
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
      margin: { left: 8, right: 8, bottom: 24 },
      didDrawPage: () => {
        const currentPage = (doc as any).internal.pages.length - 1;
        if (currentPage > 1) {
          // Premium repeat header on new pages
          doc.setFillColor(16, 70, 150);
          doc.rect(0, 0, pageWidth, 9, 'F');
          
          doc.setFillColor(34, 197, 94);
          doc.rect(0, 0, pageWidth, 0.6, 'F');
          
          doc.setFillColor(236, 72, 153);
          doc.rect(0, 8.4, pageWidth, 0.6, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9.5);
          doc.setFont('helvetica', 'bold');
          doc.text(`${title || 'Report'} - Continued`, 10, 5.5);
          
          doc.setDrawColor(99, 102, 241);
          doc.setLineWidth(0.3);
          doc.line(0, 9, pageWidth, 9);
        }
      },
    });

    // ===== PREMIUM FOOTER SECTION =====
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Premium footer background with gradient effect
      doc.setFillColor(15, 35, 75); // Dark navy
      doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
      
      // Colorful footer accent bars
      doc.setFillColor(34, 197, 94); // Green top
      doc.rect(0, pageHeight - 18, pageWidth, 0.5, 'F');
      
      doc.setFillColor(99, 102, 241); // Indigo middle
      doc.rect(0, pageHeight - 17.5, pageWidth, 0.3, 'F');
      
      doc.setFillColor(236, 72, 153); // Pink bottom
      doc.rect(0, pageHeight - 0.3, pageWidth, 0.3, 'F');
      
      // Footer content with premium styling
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      
      // Left: Company with vibrant color
      doc.setTextColor(34, 197, 94);
      doc.text(`© ${companyName}`, 8, pageHeight - 13);
      
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(186, 230, 253);
      doc.text('Business Intelligence Report', 8, pageHeight - 9.5);
      
      doc.setFontSize(5);
      doc.setTextColor(148, 163, 184);
      doc.text('Generated with Premium Export System', 8, pageHeight - 6);
      
      // Center: Page with modern styling
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 12.5, { align: 'center' });
      
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      const status = i === pageCount ? 'Complete' : 'Continued';
      doc.text(`Status: ${status}`, pageWidth / 2, pageHeight - 8.5, { align: 'center' });
      
      // Right: Timestamp with premium styling
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(236, 72, 153);
      
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      doc.text(`Date: ${dateStr}`, pageWidth - 8, pageHeight - 12.5, { align: 'right' });
      
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(186, 230, 253);
      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      doc.text(`Time: ${timeStr}`, pageWidth - 8, pageHeight - 8.5, { align: 'right' });
    }

    doc.save(`${filename}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToExcel} className="gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="gap-2">
          <FileText className="w-4 h-4 text-red-600" />
          Export to PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
