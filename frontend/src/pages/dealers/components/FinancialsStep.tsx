import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { FormGrid } from "@/components/ui/form-grid"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DBDealer } from "@/lib/types"

interface FinancialsStepProps {
  formData: Partial<DBDealer>
  users: any[]
  onChange: (field: keyof DBDealer, value: any) => void
  readOnly?: boolean
}

export function FinancialsStep({ formData, users, onChange, readOnly }: FinancialsStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <FormGrid>
        <FormField label="Credit Limit">
          <div className="relative">
            <span className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 font-medium text-sm">Rs.</span>
            <Input 
              className="h-11 pl-10" type="number" step="0.01"
              value={formData.credit_limit || 0} 
              onChange={(e) => onChange('credit_limit', parseFloat(e.target.value) || 0)} 
              disabled={readOnly}
            />
          </div>
        </FormField>
        <FormField label="Percentage (%)">
          <div className="relative">
            <Input 
              className="h-11 pr-10" type="number" step="0.01"
              value={formData.percentage || 0} 
              onChange={(e) => onChange('percentage', parseFloat(e.target.value) || 0)} 
              disabled={readOnly}
            />
            <span className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 font-medium text-sm">%</span>
          </div>
        </FormField>
      </FormGrid>
      <FormGrid>
        <FormField label="Sales Person">
          <Select 
            value={formData.salesperson_id?.toString() || ''} 
            onValueChange={(val) => onChange('salesperson_id', val)}
            disabled={readOnly}
          >
            <SelectTrigger className="h-11"><SelectValue placeholder="Assign Person" /></SelectTrigger>
            <SelectContent>
              {users?.map((u: any) => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Fax Number">
          <Input 
            className="h-11" placeholder="Fax number"
            value={formData.fax_number || ''} 
            onChange={(e) => onChange('fax_number', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
      </FormGrid>
    </div>
  )
}
