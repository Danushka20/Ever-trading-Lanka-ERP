import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { FormGrid } from "@/components/ui/form-grid"
import type { DBSupplier } from "@/lib/types"

interface AddressStepProps {
  formData: Partial<DBSupplier>
  onChange: (field: keyof DBSupplier, value: string) => void
  readOnly?: boolean
}

export function AddressStep({ formData, onChange, readOnly }: AddressStepProps) {
  return (
    <FormGrid columns={2}>
      <FormField label="Address Line 1" className="col-span-2">
        <Input 
          className="h-11" placeholder="Enter address line 1"
          value={formData.address_line1 || ''} 
          onChange={(e) => onChange('address_line1', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="Address Line 2">
        <Input 
          className="h-11" placeholder="Enter address line 2"
          value={formData.address_line2 || ''} 
          onChange={(e) => onChange('address_line2', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="Address Line 3">
        <Input 
          className="h-11" placeholder="Enter address line 3"
          value={formData.address_line3 || ''} 
          onChange={(e) => onChange('address_line3', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="Main Town">
        <Input 
          className="h-11" placeholder="Enter main town"
          value={formData.main_town || ''} 
          onChange={(e) => onChange('main_town', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="Full Address (Legacy)" className="col-span-2">
        <Textarea 
          rows={2} placeholder="Enter complete address..."
          value={formData.address || ''} 
          onChange={(e) => onChange('address', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
    </FormGrid>
  )
}
