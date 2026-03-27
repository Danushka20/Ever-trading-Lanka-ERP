import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { SecurityCodeDialog } from "@/components/SecurityCodeDialog"
import type { DBDealer } from "@/lib/types"
import { DealerDialog } from "../DealerDialog"

interface DealersDialogsProps {
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  selectedDealer: DBDealer | null
  fetchDealers: () => void
  isReadOnly: boolean
  securityDialogOpen: boolean
  setSecurityDialogOpen: (open: boolean) => void
  onSecurityVerified: () => void
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
  confirmDelete: () => Promise<void>
  deleting: boolean
}

export function DealersDialogs({
  isDialogOpen,
  setIsDialogOpen,
  selectedDealer,
  fetchDealers,
  isReadOnly,
  securityDialogOpen,
  setSecurityDialogOpen,
  onSecurityVerified,
  deleteDialogOpen,
  setDeleteDialogOpen,
  confirmDelete,
  deleting,
}: DealersDialogsProps) {
  return (
    <>
      <DealerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        dealer={selectedDealer}
        onSuccess={fetchDealers}
        readOnly={isReadOnly}
      />

      <SecurityCodeDialog
        open={securityDialogOpen}
        onOpenChange={setSecurityDialogOpen}
        onVerified={onSecurityVerified}
        expectedCode="1234"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Dealer"
        description="Are you sure you want to delete this dealer? This action cannot be undone."
        confirmText="Delete Dealer"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
        loading={deleting}
      />
    </>
  )
}
