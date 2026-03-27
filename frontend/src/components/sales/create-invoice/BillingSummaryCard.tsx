import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface BillingSummaryCardProps {
  subTotal: number
  finalTotal: number
  discount: number
  settleAmount: number
  onDiscountChange: (discount: number) => void
  onSettleAmountChange: (amount: number) => void
}

export function BillingSummaryCard({ 
  subTotal, 
  finalTotal, 
  discount, 
  settleAmount,
  onDiscountChange,
  onSettleAmountChange 
}: BillingSummaryCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Billing Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-semibold">Rs.{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Discount (Rs.)</span>
          <Input
            className="w-24 h-8 text-right"
            type="number"
            value={discount}
            onChange={e => onDiscountChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="flex justify-between pt-2 text-sm border-t border-slate-100">
          <span className="font-medium text-slate-700">Final Total</span>
          <span className="font-bold">Rs.{finalTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-blue-600">Settle Amount (Rs.)</span>
          <Input
            className="w-24 h-8 text-right border-blue-200 focus:ring-blue-500"
            type="number"
            value={settleAmount}
            onChange={e => onSettleAmountChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="flex items-end justify-between pt-4 border-t">
          <div>
            <span className="block text-xs text-slate-400">BALANCE DUE</span>
            <span className="text-2xl font-bold text-red-600">
              Rs.{(finalTotal - settleAmount).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
