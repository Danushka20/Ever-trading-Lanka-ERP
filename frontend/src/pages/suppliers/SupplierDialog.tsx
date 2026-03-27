import type { DBSupplier } from "@/lib/types"
import { BaseDialog } from "@/components/ui/base-dialog"
import { useSupplierDialogData } from "@/hooks/suppliers/useSupplierDialogData"
import { SupplierDialogFooterActions } from "./components/SupplierDialogFooterActions"
import { SupplierDialogSections } from "./components/SupplierDialogSections"

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: DBSupplier | null
  onSuccess: () => void
  readOnly?: boolean
}

export function SupplierDialog({ open, onOpenChange, supplier, onSuccess, readOnly = false }: SupplierDialogProps) {
  const {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
  } = useSupplierDialogData({
    open,
    supplier,
    onSuccess,
    onOpenChange,
  })

  const DialogFooterBtns = (
    <SupplierDialogFooterActions
      readOnly={readOnly}
      loading={loading}
      isEdit={!!supplier}
      onClose={() => onOpenChange(false)}
    />
  )

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={readOnly ? 'Review Supplier' : (supplier ? 'Edit Supplier' : 'Add New Supplier')}
      description={readOnly ? 'Review supplier information.' : (supplier ? 'Update supplier information below.' : 'Add a new supplier to your directory.')}
      onSubmit={handleSubmit}
      footer={DialogFooterBtns}
      maxWidth="sm:max-w-2xl"
    >
      <SupplierDialogSections
        formData={formData}
        readOnly={readOnly}
        onChange={handleInputChange}
      />
    </BaseDialog>
  )
}
