import { Button } from "@/components/ui/button"

interface ItemDialogFooterActionsProps {
  loading: boolean
  isEdit: boolean
  onCancel: () => void
}

export function ItemDialogFooterActions({ loading, isEdit, onCancel }: ItemDialogFooterActionsProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="px-5 h-11 border-slate-200 hover:bg-slate-50"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="px-6 shadow-sm h-11 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (isEdit ? "Update Item" : "Add Item")}
      </Button>
    </>
  )
}
