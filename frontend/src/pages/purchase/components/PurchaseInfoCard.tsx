import { Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DBSupplier } from "@/lib/types"

interface PurchaseInfoCardProps {
  suppliers: DBSupplier[]
  supplierId: string
  orderDate: string
  onSupplierChange: (value: string) => void
  onOrderDateChange: (value: string) => void
}

export function PurchaseInfoCard({
  suppliers,
  supplierId,
  orderDate,
  onSupplierChange,
  onOrderDateChange,
}: PurchaseInfoCardProps) {
  return (
    <Card className="md:col-span-2 border-none shadow-sm">
      <CardHeader>
        <CardTitle>PO Information</CardTitle>
        <CardDescription>Basic details for this stock entry.</CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Select value={supplierId} onValueChange={onSupplierChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Search Supplier..." />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}{" "}
                  <span className="text-xs text-muted-foreground">({supplier.company_name ?? ""})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Purchase Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-9 bg-white"
              value={orderDate}
              onChange={(e) => onOrderDateChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
