import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { FormGrid } from "@/components/ui/form-grid"
import type { DBSupplier } from "@/lib/types"

interface ContactStepProps {
  formData: Partial<DBSupplier>
  onChange: (field: keyof DBSupplier, value: string) => void
  readOnly?: boolean
}

export function ContactStep({ formData, onChange, readOnly }: ContactStepProps) {
  return (
    <FormGrid columns={2}>
      <FormField label="Primary Phone Number">
        <Input 
          className="h-11" placeholder="+1 (555) 000-0000"
          value={formData.phone || ''} 
          onChange={(e) => onChange('phone', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="Secondary Phone Number">
        <Input 
          className="h-11" placeholder="+1 (555) 000-0000"
          value={formData.secondary_phone || ''} 
          onChange={(e) => onChange('secondary_phone', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="WhatsApp Number" className="mt-0">
        <Input 
          className="h-11" placeholder="+1 (555) 000-0000"
          value={formData.whatsapp_number || ''} 
          onChange={(e) => onChange('whatsapp_number', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
    </FormGrid>
  )
}
