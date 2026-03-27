import React from "react"
import type { DBDealer } from "@/lib/types"

interface BillingInfoProps {
  invoice: any
  dealer: DBDealer | null
  sales_areas: any[]
}

export const BillingInfo: React.FC<BillingInfoProps> = ({ invoice, dealer, sales_areas }) => {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-full" />
      <h3 className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 mb-4">Bill To</h3>
      <div className="space-y-2">
        <p className="text-xl font-black text-slate-900 leading-tight">
          {dealer?.name || invoice.customer_name}
        </p>
        {(dealer?.phone || (invoice as any).customer_phone) && (
          <p className="text-sm font-bold text-slate-600">
            Ph: {dealer?.phone || (invoice as any).customer_phone}
          </p>
        )}
        <div className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
          {dealer ? (
            <>
              {dealer.address_line1 && <div>{dealer.address_line1}</div>}
              {dealer.address_line2 && <div>{dealer.address_line2}</div>}
              {dealer.address_line3 && <div>{dealer.address_line3}</div>}
              {dealer.main_town && <div>{dealer.main_town}</div>}
              {sales_areas.find((a: any) => a.id.toString() === dealer.sales_area_id?.toString())?.name && (
                <div className="mt-2 font-bold text-blue-600 uppercase text-[10px] tracking-widest">
                  Region: {sales_areas.find((a: any) => a.id.toString() === dealer.sales_area_id?.toString())?.name}
                </div>
              )}
            </>
          ) : (
            (invoice as any).customer_address && (
              <div className="whitespace-pre-line">{(invoice as any).customer_address}</div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
