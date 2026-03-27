import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { FormGrid, SectionTitle } from "@/components/ui/form-grid"
import { Combobox } from "@/components/ui/combobox"
import { Switch } from "@/components/ui/switch"
import type { ItemFormData } from "@/hooks/inventory/useItemDialogData"

interface ItemDialogFormSectionsProps {
  formData: ItemFormData
  categoryOptions: Array<{ value: string; label: string }>
  loading: boolean
  deletingCategory: boolean
  onInputChange: (field: keyof ItemFormData, value: string | number | boolean) => void
  onOpenCategoryDialog: () => void
  onDeleteCategory: () => void
}

export function ItemDialogFormSections({
  formData,
  categoryOptions,
  loading,
  deletingCategory,
  onInputChange,
  onOpenCategoryDialog,
  onDeleteCategory,
}: ItemDialogFormSectionsProps) {
  return (
    <>
      <div className="p-4 border shadow-sm rounded-xl border-slate-100 bg-linear-to-b from-white to-slate-50/40">
        <FormGrid>
          <FormField label="Item Name" required>
            <Input
              className="bg-white h-11 border-slate-200"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
            />
          </FormField>
          <FormField label="Item Code">
            <Input
              className="bg-white h-11 border-slate-200"
              placeholder="Enter item code"
              value={formData.sku}
              onChange={(e) => onInputChange("sku", e.target.value)}
            />
          </FormField>
        </FormGrid>

        <FormGrid className="mt-4">
          <FormField label="Category">
            <div className="flex gap-2">
              <Combobox
                options={[{ value: "none", label: "No Category" }, ...categoryOptions]}
                value={formData.category_id || "none"}
                onChange={(value) => {
                  const selectedValue = Array.isArray(value) ? value[0] : value
                  onInputChange("category_id", selectedValue === "none" ? "" : selectedValue)
                }}
                placeholder="Select category"
                searchPlaceholder="Search category..."
                emptyText="No categories found"
                clearable={false}
                className="w-full"
                inputClassName="min-h-11 bg-white border-slate-200"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 border-slate-200 shrink-0 hover:bg-blue-50"
                onClick={onOpenCategoryDialog}
                title="Add New Category"
              >
                <Plus className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-red-600 border-red-200 h-11 w-11 shrink-0 hover:text-red-700 hover:bg-red-50"
                onClick={onDeleteCategory}
                title="Delete Selected Category"
                disabled={!formData.category_id || deletingCategory || loading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </FormField>
        </FormGrid>
      </div>

      <div className="p-4 mt-6 bg-white border shadow-sm rounded-xl border-slate-100">
        <FormGrid>
          <FormField label="Reorder Level">
            <Input
              className="bg-white h-11 border-slate-200"
              type="number"
              min="0"
              placeholder="Minimum stock level"
              value={formData.reorder_level}
              onChange={(e) => onInputChange("reorder_level", parseInt(e.target.value) || 0)}
            />
          </FormField>
        </FormGrid>
      </div>

      <SectionTitle title="Pricing" className="mt-8" />
      <div className="p-4 border shadow-sm rounded-xl border-slate-100 bg-linear-to-b from-white to-slate-50/40">
        <FormGrid>
          <FormField label="Unit Cost Price">
            <div className="relative">
              <span className="absolute text-sm font-medium -translate-y-1/2 left-3 top-1/2 text-slate-500">Rs</span>
              <Input
                className="bg-white h-11 pl-11 border-slate-200"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter unit cost price"
                value={formData.buy_price}
                onChange={(e) => onInputChange("buy_price", parseFloat(e.target.value) || 0)}
              />
            </div>
          </FormField>

          <FormField label="Unit Selling Price">
            <div className="relative">
              <span className="absolute text-sm font-medium -translate-y-1/2 left-3 top-1/2 text-slate-500">Rs</span>
              <Input
                className="bg-white h-11 pl-11 border-slate-200"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter unit selling price"
                value={formData.unit_price}
                onChange={(e) => onInputChange("unit_price", parseFloat(e.target.value) || 0)}
              />
            </div>
          </FormField>
        </FormGrid>
      </div>

      <div className="p-4 mt-6 bg-white border shadow-sm rounded-xl border-slate-100">
        <FormGrid columns={1}>
          <FormField label="Description">
            <Textarea
              rows={3}
              className="bg-white border-slate-200"
              placeholder="Item description..."
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
            />
          </FormField>
        </FormGrid>
      </div>

      <div className="flex items-center justify-between p-4 mt-6 border rounded-xl border-slate-100 bg-linear-to-r from-slate-50 to-white">
        <div>
          <p className="font-medium text-slate-900">Active Status</p>
          <p className="text-sm text-slate-500">Enable or disable this item in the system</p>
        </div>
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => onInputChange("is_active", checked)}
        />
      </div>
    </>
  )
}
