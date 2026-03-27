import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ExportButton } from "@/components/ExportButton"
import { SearchableFilter } from "@/components/SearchableFilter"

export interface StockExportRow {
  item_code: string
  product_name: string
  category: string
  quantity: number
  qty_validation: string
  unit_cost: string
  total_cost: string
  cost_validation: string
  unit_selling: string
  total_selling: string
  sales_validation: string
}

interface StockListToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  itemCodeFilter: string
  onItemCodeFilterChange: (value: string) => void
  itemCodeOptions: string[]
  exportRows: StockExportRow[]
}

export function StockListToolbar({
  searchQuery,
  onSearchChange,
  itemCodeFilter,
  onItemCodeFilterChange,
  itemCodeOptions,
  exportRows,
}: StockListToolbarProps) {
  const itemCodeFilterOptions = [
    { value: "all", label: "All Item Codes" },
    ...itemCodeOptions.map((code) => ({ value: code, label: code })),
  ]

  return (
    <div className="flex items-center justify-between gap-3 pt-4 flex-wrap">
      <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
        <div className="relative w-full max-w-sm">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search product/code/category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <SearchableFilter
          options={itemCodeFilterOptions}
          value={itemCodeFilter}
          onChange={onItemCodeFilterChange}
          label="Code:"
          placeholder="All Item Codes"
          searchPlaceholder="Search item code..."
          width="220px"
        />
      </div>
      <ExportButton
        data={exportRows}
        filename={`stock_summary_${new Date().toISOString().split("T")[0]}`}
        title="Stock Summary Report"
        columns={[
          { header: "Item Code", key: "item_code" },
          { header: "Product Name", key: "product_name" },
          { header: "Category", key: "category" },
          { header: "Quantity", key: "quantity" },
          { header: "Qty Validation", key: "qty_validation" },
          { header: "Unit Cost", key: "unit_cost" },
          { header: "Qty x Cost", key: "total_cost" },
          { header: "Cost Validation", key: "cost_validation" },
          { header: "Unit Selling", key: "unit_selling" },
          { header: "Qty x Selling", key: "total_selling" },
          { header: "Sales Validation", key: "sales_validation" },
        ]}
      />
    </div>
  )
}
