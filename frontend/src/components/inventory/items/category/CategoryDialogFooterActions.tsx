import { Button } from "@/components/ui/button"

interface CategoryDialogFooterActionsProps {
  loading: boolean
  deleting: boolean
  isEdit: boolean
  onCancel: () => void
  onDelete: () => void
}

export function CategoryDialogFooterActions({
  loading,
  deleting,
  isEdit,
  onCancel,
  onDelete,
}: CategoryDialogFooterActionsProps) {
  return (
    <>
      {isEdit && (
        <Button
          type="button"
          className="h-11 text-white bg-red-600 hover:bg-red-700"
          onClick={onDelete}
          disabled={loading || deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      )}
      <Button type="button" variant="outline" className="h-11" onClick={onCancel} disabled={loading || deleting}>
        Cancel
      </Button>
      <Button type="submit" disabled={loading || deleting} className="h-11 bg-blue-600 hover:bg-blue-700">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
            <span>Saving...</span>
          </div>
        ) : isEdit ? "Update Category" : "Add Category"}
      </Button>
    </>
  )
}
