import { Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-picker"
import { ExportButton } from "@/components/ExportButton"
import type { DBPurchaseOrder, DBSupplier } from "@/lib/types"

interface PurchaseListToolbarProps {
  supplierFilter: string
  onSupplierFilterChange: (value: string) => void
  suppliers: DBSupplier[]
  dateRange: { start: Date | null; end: Date | null }
  onDateRangeChange: (start: Date | null, end: Date | null) => void
  filteredPurchases: DBPurchaseOrder[]
}

export function PurchaseListToolbar({
  supplierFilter,
  onSupplierFilterChange,
  suppliers,
  dateRange,
  onDateRangeChange,
  filteredPurchases,
}: PurchaseListToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-2 transition-all bg-white border shadow-sm border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20">
        <Filter className="w-4 h-4 ml-1 text-slate-400" />
        <Select value={supplierFilter} onValueChange={onSupplierFilterChange}>
          <SelectTrigger className="border-none shadow-none focus:ring-0 w-35 text-slate-700 font-medium h-9">
            <SelectValue placeholder="All Suppliers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Suppliers</SelectItem>
            {[...suppliers].sort((a, b) => a.name.localeCompare(b.name)).map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id.toString()}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-75">
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={onDateRangeChange}
          placeholder="Filter by date..."
        />
      </div>

      <ExportButton
        data={filteredPurchases}
        filename={`purchase_orders_${new Date().toISOString().split("T")[0]}`}
        title="Purchase Orders Report"
        columns={[
          { header: "Order ID", key: "id" },
          { header: "Supplier", key: "supplier.name" },
          { header: "Date", key: "order_date" },
          { header: "Items", key: "items_count" },
          { header: "Total Amount", key: "total_amount" },
          { header: "Status", key: "status" },
        ]}
      />
    </div>
  )
}
