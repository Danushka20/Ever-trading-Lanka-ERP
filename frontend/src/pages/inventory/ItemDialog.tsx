import { BaseDialog } from "@/components/ui/base-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { CategoryDialog } from "./CategoryDialog"
import { ItemDialogFooterActions } from "@/components/inventory/items/dialog/ItemDialogFooterActions"
import { ItemDialogFormSections } from "@/components/inventory/items/dialog/ItemDialogFormSections"
import { useItemDialogData } from "@/hooks/inventory/useItemDialogData"
import type { DBItem } from "@/lib/types"

interface ItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: DBItem | null
  onSuccess: () => void
}

export function ItemDialog({ open, onOpenChange, item, onSuccess }: ItemDialogProps) {
  const {
    formData,
    loading,
    deletingCategory,
    categoryDialogOpen,
    setCategoryDialogOpen,
    categoryDeleteDialogOpen,
    setCategoryDeleteDialogOpen,
    handleInputChange,
    handleSubmit,
    handleDeleteCategory,
    confirmDeleteCategory,
    categoryOptions,
  } = useItemDialogData({ open, item, onSuccess, onOpenChange })

  const DialogFooterBtns = (
    <ItemDialogFooterActions
      loading={loading}
      isEdit={!!item}
      onCancel={() => onOpenChange(false)}
    />
  )

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Edit Item' : 'Add New Item'}
      description={item ? 'Update item information below.' : 'Add a new inventory item.'}
      onSubmit={handleSubmit}
      footer={DialogFooterBtns}
    >
      <ItemDialogFormSections
        formData={formData}
        categoryOptions={categoryOptions}
        loading={loading}
        deletingCategory={deletingCategory}
        onInputChange={handleInputChange}
        onOpenCategoryDialog={() => setCategoryDialogOpen(true)}
        onDeleteCategory={handleDeleteCategory}
      />

      <CategoryDialog 
        open={categoryDialogOpen} 
        onOpenChange={setCategoryDialogOpen}
        onSuccess={() => setCategoryDialogOpen(false)}
      />

      <ConfirmDialog
        open={categoryDeleteDialogOpen}
        onOpenChange={setCategoryDeleteDialogOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteCategory}
        variant="danger"
        loading={deletingCategory}
      />
    </BaseDialog>
  )
}
