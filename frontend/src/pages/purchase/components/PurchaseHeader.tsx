import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PurchaseHeaderProps {
  onBack: () => void
}

export function PurchaseHeader({ onBack }: PurchaseHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Record Purchase</h2>
          <p className="text-muted-foreground">Add new stock inventory from suppliers</p>
        </div>
      </div>
    </div>
  )
}
