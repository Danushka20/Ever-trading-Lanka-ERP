import type { DBDealer } from "@/lib/types"
import { BaseDialog } from "@/components/ui/base-dialog";
import { useDealerDialogData } from "@/hooks/dealers/useDealerDialogData"
import { DealerDialogFooterActions } from "./components/DealerDialogFooterActions"
import { DealerDialogSections } from "./components/DealerDialogSections"

interface DealerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealer?: DBDealer | null;
  onSuccess: () => void;
  readOnly?: boolean;
}

export function DealerDialog({ open, onOpenChange, dealer, onSuccess, readOnly = false }: DealerDialogProps) {
  const {
    formData,
    loading,
    areas,
    users,
    selectedArea,
    handleInputChange,
    handleSubmit,
  } = useDealerDialogData({
    open,
    dealer,
    onSuccess,
    onOpenChange,
  })

  const DialogFooterBtns = (
    <DealerDialogFooterActions
      readOnly={readOnly}
      loading={loading}
      isEdit={!!dealer}
      onClose={() => onOpenChange(false)}
    />
  )

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={readOnly ? 'Review Dealer' : (dealer ? 'Edit Dealer' : 'Add New Dealer')}
      description={readOnly ? 'Review dealer information.' : (dealer ? 'Update dealer information below.' : 'Add a new dealer to your directory.')}
      onSubmit={handleSubmit}
      footer={DialogFooterBtns}
      maxWidth="sm:max-w-2xl"
    >
      <DealerDialogSections
        formData={formData}
        areas={areas}
        users={users}
        selectedArea={selectedArea}
        readOnly={readOnly}
        onChange={handleInputChange}
      />
    </BaseDialog>
  )
}

