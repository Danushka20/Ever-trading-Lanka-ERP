import { User, FileText, CheckCircle } from "lucide-react"
import type { DBDealer, DBSalesArea } from "@/lib/types"

interface ReviewStepProps {
  formData: Partial<DBDealer>
  selectedArea: DBSalesArea | undefined
}

export function ReviewStep({ formData, selectedArea }: ReviewStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
        <h4 className="flex items-center gap-2 text-sm font-bold text-blue-900 uppercase tracking-wider mb-4">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          Review Dealer Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Dealer Name</p>
            <p className="text-sm font-bold text-slate-700">{formData.name || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Main Town</p>
            <p className="text-sm font-bold text-slate-700">{formData.main_town || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Sales Area</p>
            <p className="text-sm font-bold text-slate-700">{selectedArea?.name || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Category</p>
            <p className="text-sm font-bold text-slate-700">{formData.category ? `Category ${formData.category}` : '-'}</p>
          </div>
          <div className="space-y-1 border-t border-blue-100 pt-2 md:col-span-2">
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Credit Limit</p>
                <p className="text-sm font-bold text-blue-700">Rs. {Number(formData.credit_limit || 0).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px) font-bold text-slate-400 uppercase tracking-tight">Percentage</p>
                <p className="text-sm font-bold text-slate-700">{formData.percentage || 0}%</p>
              </div>
            </div>
          </div>
          <div className="space-y-1 md:col-span-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Contact Information</p>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                <User className="h-3 w-3" /> {formData.phone || 'No phone'}
              </p>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                <FileText className="h-3 w-3" /> {formData.email || 'No email'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30">
        <p className="text-xs text-amber-800 flex items-start gap-2">
          <FileText className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Please double check all information before finalizing. You can go back to any step to make corrections if needed.</span>
        </p>
      </div>
    </div>
  )
}
