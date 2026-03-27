import type { ReactNode } from "react"
import { CreditCard, MapPin, PhoneCall, User } from "lucide-react"
import type { DBSupplier } from "@/lib/types"
import { GeneralStep } from "./GeneralStep"
import { ContactStep } from "./ContactStep"
import { AddressStep } from "./AddressStep"
import { FinancialsStep } from "./FinancialsStep"

interface SupplierDialogSectionsProps {
  formData: Partial<DBSupplier>
  readOnly: boolean
  onChange: (field: keyof DBSupplier, value: any) => void
}

interface SectionHeaderProps {
  title: string
  icon: ReactNode
}

function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <div className="p-1.5 rounded-md">{icon}</div>
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">{title}</h3>
    </div>
  )
}

export function SupplierDialogSections({ formData, readOnly, onChange }: SupplierDialogSectionsProps) {
  return (
    <div className="space-y-8 pb-4">
      <div className="space-y-4">
        <SectionHeader
          title="General Information"
          icon={
            <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
              <User className="w-4 h-4" />
            </div>
          }
        />
        <GeneralStep formData={formData} onChange={onChange} readOnly={readOnly} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Contact Details"
          icon={
            <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-600">
              <PhoneCall className="w-4 h-4" />
            </div>
          }
        />
        <ContactStep formData={formData} onChange={onChange} readOnly={readOnly} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Address Information"
          icon={
            <div className="p-1.5 bg-amber-50 rounded-md text-amber-600">
              <MapPin className="w-4 h-4" />
            </div>
          }
        />
        <AddressStep formData={formData} onChange={onChange} readOnly={readOnly} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Financial & Tax Details"
          icon={
            <div className="p-1.5 bg-purple-50 rounded-md text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
          }
        />
        <FinancialsStep formData={formData} onChange={onChange} readOnly={readOnly} />
      </div>
    </div>
  )
}
