import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { FormGrid } from "@/components/ui/form-grid"
import type { DBSupplier } from "@/lib/types"

interface GeneralStepProps {
  formData: Partial<DBSupplier>
  onChange: (field: keyof DBSupplier, value: string) => void
  readOnly?: boolean
}

export function GeneralStep({ formData, onChange, readOnly }: GeneralStepProps) {
  return (
    <FormGrid columns={2}>
      <FormField label="Business Name" required className="col-span-2">
        <Input 
          className="h-11" placeholder="Enter business name"
          value={formData.name || ''} 
          onChange={(e) => onChange('name', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="Contact Person" className="mt-4">
        <Input 
          className="h-11" placeholder="Contact person name"
          value={formData.contact_person || ''} 
          onChange={(e) => onChange('contact_person', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="Email Address" className="mt-4">
        <Input 
          className="h-11" type="email" placeholder="email@example.com"
          value={formData.email || ''} 
          onChange={(e) => onChange('email', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
    </FormGrid>
  )
}
