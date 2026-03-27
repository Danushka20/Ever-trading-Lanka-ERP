import { Plus } from "lucide-react"
import PageHeader from "@/components/ui/page-header"
import { ExportButton } from "@/components/ExportButton"
import { SearchableFilter } from "@/components/SearchableFilter"
import type { DBSupplier } from "@/lib/types"

interface SuppliersHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedBusiness: string
  onSelectedBusinessChange: (value: string) => void
  businessOptions: Array<{ value: string; label: string }>
  filteredSuppliers: DBSupplier[]
  exportColumns: Array<{ header: string; key: string }>
  onAddSupplier: () => void
}

export function SuppliersHeader({
  searchQuery,
  onSearchChange,
  selectedBusiness,
  onSelectedBusinessChange,
  businessOptions,
  filteredSuppliers,
  exportColumns,
  onAddSupplier,
}: SuppliersHeaderProps) {
  return (
    <PageHeader
      title="Suppliers"
      description="Manage your suppliers, contact information and credentials."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search suppliers..."
      showSearch
      primaryAction={{
        label: "Add New Supplier",
        icon: Plus,
        onClick: onAddSupplier,
      }}
      toolbar={
        <div className="flex items-center gap-3">
          <SearchableFilter
            options={businessOptions}
            value={selectedBusiness}
            onChange={onSelectedBusinessChange}
            label="Business:"
            placeholder="All Businesses"
            searchPlaceholder="Search business..."
          />
          <ExportButton
            data={filteredSuppliers}
            filename="Suppliers_List"
            columns={exportColumns}
            title="Supplier Directory"
          />
        </div>
      }
    />
  )
}
