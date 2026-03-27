import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SupplierDialogFooterActionsProps {
  readOnly: boolean
  loading: boolean
  isEdit: boolean
  onClose: () => void
}

export function SupplierDialogFooterActions({
  readOnly,
  loading,
  isEdit,
  onClose,
}: SupplierDialogFooterActionsProps) {
  return (
    <div className="flex justify-end gap-3 w-full">
      <Button variant="outline" type="button" className="h-11" onClick={onClose} disabled={loading}>
        {readOnly ? "Close" : "Cancel"}
      </Button>
      {!readOnly && (
        <Button type="submit" disabled={loading} className="bg-blue-600 h-11 hover:bg-blue-700 min-w-32">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isEdit ? "Update Supplier" : "Add Supplier"}
        </Button>
      )}
    </div>
  )
}
