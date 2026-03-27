import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { SecurityCodeDialog } from "@/components/SecurityCodeDialog"
import { SupplierDialog } from "../SupplierDialog"
import type { DBSupplier } from "@/lib/types"

interface SuppliersDialogsProps {
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  selectedSupplier: DBSupplier | null
  refetchSuppliers: () => void
  isReadOnlyMode: boolean
  securityDialogOpen: boolean
  onSecurityDialogOpenChange: (open: boolean) => void
  pendingAction: "edit" | "delete" | null
  onSecurityVerified: () => void
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
  confirmDelete: () => Promise<void>
  deleting: boolean
}

export function SuppliersDialogs({
  isDialogOpen,
  setIsDialogOpen,
  selectedSupplier,
  refetchSuppliers,
  isReadOnlyMode,
  securityDialogOpen,
  onSecurityDialogOpenChange,
  pendingAction,
  onSecurityVerified,
  deleteDialogOpen,
  setDeleteDialogOpen,
  confirmDelete,
  deleting,
}: SuppliersDialogsProps) {
  return (
    <>
      <SupplierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        supplier={selectedSupplier}
        onSuccess={refetchSuppliers}
        readOnly={isReadOnlyMode}
      />

      <SecurityCodeDialog
        open={securityDialogOpen}
        onOpenChange={onSecurityDialogOpenChange}
        onVerified={onSecurityVerified}
        title={pendingAction === "delete" ? "Confirm Deletion" : "Verify access"}
        description={
          pendingAction === "delete"
            ? "Enter security code to delete this supplier."
            : "Enter security code to edit this supplier."
        }
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This action cannot be undone and may affect associated purchase orders."
        confirmText="Delete Supplier"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
        loading={deleting}
      />
    </>
  )
}
