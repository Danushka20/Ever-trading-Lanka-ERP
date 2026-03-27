import { Plus } from "lucide-react"
import { ExportButton } from "@/components/ExportButton"
import { SearchableFilter } from "@/components/SearchableFilter"
import { PageHeader } from "@/components/ui/page-header"

interface DealersHeaderProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  selectedArea: string
  onSelectedAreaChange: (value: string) => void
  areaOptions: Array<{ value: string; label: string }>
  exportData: any[]
  exportColumns: Array<{ header: string; key: string }>
  onAddDealer: () => void
}

export function DealersHeader({
  searchTerm,
  onSearchTermChange,
  selectedArea,
  onSelectedAreaChange,
  areaOptions,
  exportData,
  exportColumns,
  onAddDealer,
}: DealersHeaderProps) {
  return (
    <PageHeader
      title="Dealers"
      description="Manage your dealer network, sales areas and credit limits."
      searchValue={searchTerm}
      onSearchChange={onSearchTermChange}
      searchPlaceholder="Search dealers..."
      showSearch
      primaryAction={{
        label: "Add New Dealer",
        icon: Plus,
        onClick: onAddDealer,
      }}
      toolbar={
        <div className="flex items-center gap-3">
          <SearchableFilter
            options={areaOptions}
            value={selectedArea}
            onChange={onSelectedAreaChange}
            label="Area:"
            placeholder="All Areas"
            searchPlaceholder="Search areas..."
          />
          <ExportButton
            data={exportData}
            filename="Dealers_List"
            columns={exportColumns}
            title="Dealer Network Report"
          />
        </div>
      }
    />
  )
}
