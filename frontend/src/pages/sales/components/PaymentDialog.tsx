import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import type { DBInvoice } from "@/lib/types"
import { CheckCircle2, Loader2 } from "lucide-react"

interface PaymentDialogProps {
  invoice: DBInvoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentDialog({ invoice, open, onOpenChange }: PaymentDialogProps) {
  const [amount, setAmount] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const total = Number(invoice?.total || 0)
  const settled = Number(invoice?.settle_amount || 0)
  const balance = total - settled

  // Initialize amount with balance when the dialog opens
  useEffect(() => {
    if (open && invoice) {
      setAmount(balance.toString())
    }
  }, [open, invoice, balance])

  const handleSettle = async () => {
    if (!invoice || !amount || isNaN(Number(amount))) return

    setLoading(true)
    try {
      await api.post(`invoices/${invoice.id}/settle`, {
        amount: Number(amount)
      })
      
      // Invalidate queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["invoices"] })
      await queryClient.refetchQueries({ queryKey: ["invoices"] })
      
      onOpenChange(false)
      setAmount("")
    } catch (error) {
      console.error("Failed to update payment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Add Payment
          </DialogTitle>
          <DialogDescription>
            Record a payment for invoice {invoice?.invoice_no}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50 border-slate-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Amount</p>
              <p className="text-sm font-bold text-slate-700">Rs. {total.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Balance Due</p>
              <p className="text-sm font-bold text-red-600">Rs. {balance.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-bold text-slate-700">Payment Amount (Rs.)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-lg font-bold border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSettle} 
            disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0 || loading}
            className="bg-blue-600 hover:bg-blue-700 min-w-[100px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Complete Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
