import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle } from "lucide-react"

interface SecurityCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified: () => void
  expectedCode?: string
  title?: string
  description?: string
}

export function SecurityCodeDialog({
  open,
  onOpenChange,
  onVerified,
  expectedCode = "1234", // Default code, can be customized via props
  title = "Security Verification",
  description = "Please enter the security code to proceed with editing."
}: SecurityCodeDialogProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  const handleVerify = () => {
    if (code === expectedCode) {
      setError(false)
      setCode("")
      onVerified()
      onOpenChange(false)
    } else {
      setError(true)
    }
  }

  const handleClose = () => {
    setCode("")
    setError(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="security-code" className="text-sm font-semibold">
                Security Code
              </Label>
              <Input
                id="security-code"
                type="password"
                placeholder="Enter 4-digit code"
                className={`text-center text-2xl tracking-[1em] font-bold ${
                  error ? "border-red-500 ring-red-500" : ""
                }`}
                value={code}
                onChange={(e) => {
                  setError(false)
                  setCode(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerify()
                }}
                maxLength={expectedCode.length}
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4" />
                Invalid security code. Please try again.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-32">
            Cancel
          </Button>
          <Button onClick={handleVerify} className="w-full sm:w-32 bg-blue-600 hover:bg-blue-700">
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
