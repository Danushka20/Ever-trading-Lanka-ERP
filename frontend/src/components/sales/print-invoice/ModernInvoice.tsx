import React from "react"
import type { PrintableInvoiceProps } from "./types"
import { InvoiceHeader } from "./InvoiceHeader"
import { BillingInfo } from "./BillingInfo"
import { InvoiceSummary } from "./InvoiceSummary"
import { InvoiceItemsTable } from "./InvoiceItemsTable"
import { SignatureSection } from "./SignatureSection"
export const ModernInvoice: React.FC<PrintableInvoiceProps> = ({ 
  invoice, 
  dealer, 
  items_list, 
  sales_areas, 
  companyInfo 
}) => {
  return (
    <div className="p-4 sm:p-8 text-slate-800">
      {/* Header Section */}
      <InvoiceHeader invoice={invoice} companyInfo={companyInfo} />
      {/* Billing & Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        <BillingInfo invoice={invoice} dealer={dealer} sales_areas={sales_areas} />
        <InvoiceSummary invoice={invoice} />
      </div>
      {/* Items Table */}
      <InvoiceItemsTable invoice={invoice} items_list={items_list} />
      {/* Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-12 mt-12 mb-8">
        <div className="flex flex-col justify-end">
          <SignatureSection companyInfo={companyInfo} />
        </div>
      </div>
    </div>
  )
}
