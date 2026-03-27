import React from "react"

interface SignatureSectionProps {
  companyInfo: any
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({ companyInfo }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-8">
        <div className="text-center pt-8 border-t-2 border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authorized By</p>
        </div>
        <div className="text-center pt-8 border-t-2 border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer Signature</p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-slate-200" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 italic">Thank you for your business</p>
          <div className="h-px w-12 bg-slate-200" />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {companyInfo?.name} ERP System | Printed on {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
