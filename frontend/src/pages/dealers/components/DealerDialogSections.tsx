import type { ReactNode } from "react"
import { CreditCard, FileText, MapPin, User } from "lucide-react"
import type { DBDealer, DBSalesArea } from "@/lib/types"
import { GeneralStep } from "./GeneralStep"
import { AddressStep } from "./AddressStep"
import { FinancialsStep } from "./FinancialsStep"
import { NotesStep } from "./NotesStep"

interface DealerDialogSectionsProps {
  formData: Partial<DBDealer>
  areas: DBSalesArea[]
  users: any[]
  selectedArea: DBSalesArea | undefined
  readOnly: boolean
  onChange: (field: keyof DBDealer, value: any) => void
}

interface SectionHeaderProps {
  title: string
  icon: ReactNode
}

function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <div className="p-1.5 rounded-md">{icon}</div>
      <h3 className="text-sm font-semibold tracking-tight uppercase text-slate-900">{title}</h3>
    </div>
  )
}

export function DealerDialogSections({
  formData,
  areas,
  users,
  selectedArea,
  readOnly,
  onChange,
}: DealerDialogSectionsProps) {
  return (
    <div className="pb-4 space-y-8">
      <div className="space-y-4">
        <SectionHeader
          title="General Information"
          icon={
            <div className="text-blue-600 bg-blue-50 rounded-md p-1.5">
              <User className="w-4 h-4" />
            </div>
          }
        />
        <GeneralStep formData={formData} onChange={onChange} readOnly={readOnly} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Address & Area Details"
          icon={
            <div className="text-amber-600 bg-amber-50 rounded-md p-1.5">
              <MapPin className="w-4 h-4" />
            </div>
          }
        />
        <AddressStep
          formData={formData}
          areas={areas}
          selectedArea={selectedArea}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Financial & Sales Targets"
          icon={
            <div className="rounded-md bg-purple-50 p-1.5 text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
          }
        />
        <FinancialsStep formData={formData} users={users} onChange={onChange} readOnly={readOnly} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="General Notes"
          icon={
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          }
        />
        <NotesStep formData={formData} onChange={onChange} readOnly={readOnly} />
      </div>
    </div>
  )
}
