import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { FormGrid } from "@/components/ui/form-grid"
import type { DBSupplier } from "@/lib/types"

interface FinancialsStepProps {
  formData: Partial<DBSupplier>
  onChange: (field: keyof DBSupplier, value: string) => void
  readOnly?: boolean
}

export function FinancialsStep({ formData, onChange, readOnly }: FinancialsStepProps) {
  return (
    <FormGrid columns={2}>
      <FormField label="Tax ID / GSTIN">
        <Input 
          className="h-11" placeholder="Tax identification number"
          value={formData.tax_id || ''} 
          onChange={(e) => onChange('tax_id', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
      <FormField label="TIN Number">
        <Input 
          className="h-11" placeholder="Enter TIN number"
          value={formData.tin_number || ''} 
          onChange={(e) => onChange('tin_number', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
    </FormGrid>
  )
}
