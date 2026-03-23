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
import type { DBDealer, DBSalesArea } from "@/lib/types"

interface AddressStepProps {
  formData: Partial<DBDealer>
  areas: DBSalesArea[]
  selectedArea: DBSalesArea | undefined
  onChange: (field: keyof DBDealer, value: any) => void
  readOnly?: boolean
}

export function AddressStep({ formData, areas, selectedArea, onChange, readOnly }: AddressStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <FormGrid>
        <FormField label="Address Line 1">
          <Input 
            className="h-11" placeholder="Building/Street 1"
            value={formData.address_line1 || ''} 
            onChange={(e) => onChange('address_line1', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
        <FormField label="Address Line 2">
          <Input 
            className="h-11" placeholder="Building/Street 2"
            value={formData.address_line2 || ''} 
            onChange={(e) => onChange('address_line2', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
      </FormGrid>
      <FormGrid>
        <FormField label="Address Line 3">
          <Input 
            className="h-11" placeholder="Area/Village"
            value={formData.address_line3 || ''} 
            onChange={(e) => onChange('address_line3', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
        <FormField label="Main Town">
          <Input 
            className="h-11" placeholder="City/Town"
            value={formData.main_town || ''} 
            onChange={(e) => onChange('main_town', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
      </FormGrid>
      <FormGrid>
        <FormField label="Sales Area">
          <Select 
            value={formData.sales_area_id?.toString() || ''} 
            onValueChange={(val) => onChange('sales_area_id', Number(val))}
            disabled={readOnly}
          >
            <SelectTrigger className="h-11"><SelectValue placeholder="Assign Area" /></SelectTrigger>
            <SelectContent>
              {areas?.map(a => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.name} {a.city ? `(${a.city})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="City (Auto-filled)">
          <Input 
            className="h-11 bg-slate-50 border-slate-200" 
            value={selectedArea?.city || ''} 
            readOnly 
            placeholder="Area town/city"
            disabled={readOnly}
          />
        </FormField>
      </FormGrid>
    </div>
  )
}
