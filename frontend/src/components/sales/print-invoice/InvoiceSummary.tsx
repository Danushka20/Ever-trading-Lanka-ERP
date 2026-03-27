import React from "react"

interface InvoiceSummaryProps {
  invoice: any
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoice }) => {
  const subTotal = Number(invoice.sub_total || (Number(invoice.total || 0) + Number(invoice.discount || 0)))
  const discountAmount = Number(invoice.discount || 0)
  const discountPercent = subTotal > 0 ? ((discountAmount / subTotal) * 100).toFixed(1) : "0.0"
  const settleAmount = Number((invoice as any).settle_amount || 0)
  const balanceDue = Number(invoice.total || 0) - settleAmount

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-400 uppercase tracking-widest">Subtotal</span>
          <span className="font-black text-slate-700">Rs.{subTotal.toLocaleString()}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex flex-col">
              <span className="font-bold text-red-400 uppercase tracking-widest">Discount</span>
              <span className="text-[10px] font-black text-red-500 uppercase">({discountPercent}% OFF)</span>
            </div>
            <span className="font-black text-red-600">-Rs.{discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="h-px bg-slate-200" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
          <span className="text-2xl font-black text-slate-900">
            Rs.{Number(invoice.total).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center bg-green-50/50 p-2 rounded-lg border border-green-100">
          <span className="text-xs font-black text-green-700 uppercase tracking-widest">Paid Amount</span>
          <span className="text-xl font-black text-green-700">
            Rs.{settleAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-lg border border-blue-100">
          <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Balance Due</span>
          <span className="text-xl font-black text-blue-700">
            Rs.{balanceDue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
