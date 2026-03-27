import { Package, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { DBPurchaseOrder, DBSupplier } from "@/lib/types"
import { PageHeader } from "@/components/ui/page-header"
import { PurchaseListToolbar } from "@/components/purchase/list/PurchaseListToolbar"

interface PurchaseListHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  supplierFilter: string
  onSupplierFilterChange: (value: string) => void
  suppliers: DBSupplier[]
  dateRange: { start: Date | null; end: Date | null }
  onDateRangeChange: (start: Date | null, end: Date | null) => void
  filteredPurchases: DBPurchaseOrder[]
}

export function PurchaseListHeader({
  searchQuery,
  onSearchChange,
  supplierFilter,
  onSupplierFilterChange,
  suppliers,
  dateRange,
  onDateRangeChange,
  filteredPurchases,
}: PurchaseListHeaderProps) {
  const navigate = useNavigate()

  return (
    <PageHeader
      title="Purchase Orders"
      description="Manage and track your inventory restocking history."
      icon={Package}
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search orders (#PO, supplier...)"
      primaryAction={{
        label: "New Order",
        onClick: () => navigate("/purchase/create"),
        icon: Plus,
      }}
      toolbar={
        <PurchaseListToolbar
          supplierFilter={supplierFilter}
          onSupplierFilterChange={onSupplierFilterChange}
          suppliers={suppliers}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          filteredPurchases={filteredPurchases}
        />
      }
    />
  )
}
