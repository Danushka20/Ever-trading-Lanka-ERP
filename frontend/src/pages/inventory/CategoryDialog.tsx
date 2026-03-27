import { BaseDialog } from "@/components/ui/base-dialog"
import { CategoryDialogFormFields } from "@/components/inventory/items/category/CategoryDialogFormFields"
import { CategoryDialogFooterActions } from "@/components/inventory/items/category/CategoryDialogFooterActions"
import { useCategoryDialogData } from "@/hooks/inventory/useCategoryDialogData"
import type { DBCategory } from "@/lib/types"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: DBCategory | null
  onSuccess: () => void
}

export function CategoryDialog({ open, onOpenChange, category, onSuccess }: CategoryDialogProps) {
  const {
    formData,
    loading,
    deleting,
    handleInputChange,
    handleSubmit,
    handleDelete,
  } = useCategoryDialogData({
    open,
    category,
    onSuccess,
    onOpenChange,
  })

  const DialogFooterBtns = (
    <CategoryDialogFooterActions
      loading={loading}
      deleting={deleting}
      isEdit={!!category}
      onCancel={() => onOpenChange(false)}
      onDelete={handleDelete}
    />
  )

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={category ? 'Edit Category' : 'Add New Category'}
      description={category ? 'Update category information below.' : 'Create a new item category.'}
      onSubmit={handleSubmit}
      footer={DialogFooterBtns}
    >
      <CategoryDialogFormFields formData={formData} onInputChange={handleInputChange} />
    </BaseDialog>
  )
}
