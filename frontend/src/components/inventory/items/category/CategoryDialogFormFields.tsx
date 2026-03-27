import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { FormGrid } from "@/components/ui/form-grid"
import type { CategoryFormData } from "@/hooks/inventory/useCategoryDialogData"

interface CategoryDialogFormFieldsProps {
  formData: CategoryFormData
  onInputChange: (field: keyof CategoryFormData, value: string) => void
}

export function CategoryDialogFormFields({ formData, onInputChange }: CategoryDialogFormFieldsProps) {
  return (
    <>
      <FormGrid columns={2}>
        <FormField label="Category Name" required>
          <Input
            className="h-11"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
          />
        </FormField>
        <FormField label="Category Number">
          <Input
            className="h-11"
            placeholder="e.g. C001"
            value={formData.category_number}
            onChange={(e) => onInputChange("category_number", e.target.value)}
          />
        </FormField>
      </FormGrid>

      <FormGrid columns={1} className="mt-6">
        <FormField label="Description">
          <Textarea
            rows={3}
            placeholder="Category description..."
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
          />
        </FormField>
      </FormGrid>
    </>
  )
}
