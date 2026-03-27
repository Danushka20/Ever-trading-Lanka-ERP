import React from "react"
import type { CompanyInfo } from "./types"

interface PaymentInfoProps {
  invoice: any
  companyInfo: CompanyInfo | null
}

export const PaymentInfo: React.FC<PaymentInfoProps> = ({ invoice }) => {
  return (
    <div>
      <h3 className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 mb-4">Payment Information</h3>
      <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-600/70 font-bold uppercase tracking-widest">Bank</span>
          <span className="font-black text-slate-700 uppercase">Commercial Bank</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-600/70 font-bold uppercase tracking-widest">Account</span>
          <span className="font-black text-slate-700 tracking-wider">1234567890123</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-600/70 font-bold uppercase tracking-widest">Branch</span>
          <span className="font-black text-slate-700 uppercase">Colombo 03</span>
        </div>
      </div>
      {invoice.notes && (
        <div className="mt-8">
          <h3 className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 mb-2">Internal Notes</h3>
          <p className="text-sm font-medium text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-100">
            "{invoice.notes}"
          </p>
        </div>
      )}
    </div>
  )
}
