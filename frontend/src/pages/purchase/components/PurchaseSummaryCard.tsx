import { Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PurchaseSummaryCardProps {
  uniqueItems: number
  totalAmount: number
  isSubmitting: boolean
}

export function PurchaseSummaryCard({ uniqueItems, totalAmount, isSubmitting }: PurchaseSummaryCardProps) {
  return (
    <Card className="border-none shadow-sm bg-blue-600 text-white">
      <CardHeader>
        <CardTitle className="text-white">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-blue-100 italic">
          <span>Unique Items</span>
          <span>{uniqueItems}</span>
        </div>
        <div className="pt-4 border-t border-blue-400">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Total Payable</p>
          <p className="text-4xl font-black">
            Rs.{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold h-12">
          <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "Recording..." : "Complete Purchase"}
        </Button>
      </CardContent>
    </Card>
  )
}
