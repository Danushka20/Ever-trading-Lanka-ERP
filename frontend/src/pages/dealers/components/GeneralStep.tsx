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

interface GeneralStepProps {
  formData: Partial<DBDealer>
  onChange: (field: keyof DBDealer, value: any) => void
  readOnly?: boolean
}

export function GeneralStep({ formData, onChange, readOnly }: GeneralStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <FormGrid>
        <FormField label="Dealer Name" required>
          <Input 
            className="h-11" placeholder="Enter dealer name"
            value={formData.name || ''} 
            onChange={(e) => onChange('name', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
        <FormField label="Email Address">
          <Input 
            className="h-11" type="email" placeholder="email@example.com"
            value={formData.email || ''} 
            onChange={(e) => onChange('email', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
      </FormGrid>
      <FormGrid>
        <FormField label="Phone Number">
          <Input 
            className="h-11" placeholder="+1 (555) 000-0000"
            value={formData.phone || ''} 
            onChange={(e) => onChange('phone', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
        <FormField label="WhatsApp Number">
          <Input 
            className="h-11" placeholder="WhatsApp number"
            value={formData.secondary_phone || ''} 
            onChange={(e) => onChange('secondary_phone', e.target.value)} 
            disabled={readOnly}
          />
        </FormField>
      </FormGrid>
      <FormGrid>
        <FormField label="Dealer Category" required>
          <Select 
            value={formData.category || ''} 
            onValueChange={(val) => onChange('category', val)}
            disabled={readOnly}
          >
            <SelectTrigger className="h-11"><SelectValue placeholder="Select Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Category 1</SelectItem>
              <SelectItem value="2">Category 2</SelectItem>
              <SelectItem value="3">Category 3</SelectItem>
              <SelectItem value="4">Category 4</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Sales Type">
          <Select 
            value={formData.sales_type || ''} 
            onValueChange={(val) => onChange('sales_type', val)}
            disabled={readOnly}
          >
            <SelectTrigger className="h-11"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Wholesale">Wholesale</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Distributor">Distributor</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormGrid>
    </div>
  )
}
