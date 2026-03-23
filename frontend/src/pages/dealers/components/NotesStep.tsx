import type { ChangeEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import type { DBDealer } from "@/lib/types"

interface NotesStepProps {
  formData: Partial<DBDealer>
  onChange: (field: keyof DBDealer, value: any) => void
  readOnly?: boolean
}

export function NotesStep({ formData, onChange, readOnly }: NotesStepProps) {
  return (
    <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <FormField label="General Notes">
        <Textarea 
          rows={6} 
          className="resize-none"
          placeholder="Enter any additional information about this dealer..."
          value={formData.general_note || ''} 
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange('general_note', e.target.value)} 
          disabled={readOnly}
        />
      </FormField>
    </div>
  )
}
