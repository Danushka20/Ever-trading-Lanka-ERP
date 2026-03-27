import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DealerDialogFooterActionsProps {
  readOnly: boolean
  loading: boolean
  isEdit: boolean
  onClose: () => void
}

export function DealerDialogFooterActions({
  readOnly,
  loading,
  isEdit,
  onClose,
}: DealerDialogFooterActionsProps) {
  return (
    <div className="flex justify-end w-full gap-3">
      <Button variant="outline" type="button" className="h-11" onClick={onClose} disabled={loading}>
        {readOnly ? "Close" : "Cancel"}
      </Button>
      {!readOnly && (
        <Button type="submit" disabled={loading} className="h-11 min-w-32 bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isEdit ? "Update Dealer" : "Add Dealer"}
        </Button>
      )}
    </div>
  )
}
