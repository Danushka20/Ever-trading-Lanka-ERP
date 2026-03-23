import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, Trash2, Info } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: "danger" | "warning" | "info"
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const iconColors = {
    danger: "text-rose-500 bg-rose-100",
    warning: "text-amber-500 bg-amber-100",
    info: "text-blue-500 bg-blue-100",
  }

  const buttonColors = {
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
  }

  const Icon = variant === "danger" ? Trash2 : variant === "warning" ? AlertTriangle : Info

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${iconColors[variant]}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-bold text-slate-900">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm text-slate-600">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
          <AlertDialogCancel 
            disabled={loading}
            className="rounded-xl border-slate-200 hover:bg-slate-100"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl ${buttonColors[variant]}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
